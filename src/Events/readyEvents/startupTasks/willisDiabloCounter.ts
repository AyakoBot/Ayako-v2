import * as ws from 'ws';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';

const helltideConnection = new ws.WebSocket(
 'wss://s-usc1b-nss-2106.firebaseio.com/.ws?v=5&p=1:869671171747:web:dd127d787b4d61d505b116&ns=helltides-7e530-default-rtdb',
 { perMessageDeflate: false },
);

helltideConnection.onmessage = async (e) => {
 if (String(Number(e.data)) !== 'NaN') return;

 try {
  JSON.parse(e.data as string);
 } catch {
  return;
 }

 const json = JSON.parse(e.data as string) as {
  d: { b: { p: string; d: { startTime: string; endTime: string; zone: string } } };
 };

 if (json.d?.b?.p === 'helltide') {
  Jobs.scheduleJob(new Date(Date.now() + 60000), () => {
   counter(new Date(json.d.b.d.endTime).getTime(), new Date(json.d.b.d.startTime).getTime());
  });
 }

 if (json.d?.b?.d?.zone) location(json.d.b.d.zone);
};

const sendMessage = () => {
 helltideConnection.send('{"t":"d","d":{"r":6,"a":"q","b":{"p":"/helltide_votes_feed","h":""}}}');
 helltideConnection.send('{"t":"d","d":{"r":4,"a":"q","b":{"p":"/helltide","h":""}}}');
};

export default async () => {
 Jobs.scheduleJob('0 0 * * * *', () => {
  helltideConnection.send('0');
  sendMessage();
 });
};

let lastField: Discord.APIEmbedField = { name: 'Location', value: 'Unknown', inline: false };

const counter = async (endTime: number, startTime: number) => {
 const embed: Discord.APIEmbed = {
  color: ch.constants.colors.ephemeral,
  title: 'Next `The Helltide Rises` event',
  url: 'https://helltides.com/',
  fields: [
   {
    name: `Starts <t:${String(startTime).slice(0, -3)}:R>`,
    value: `Ends <t:${String(endTime).slice(0, -3)}:R>`,
    inline: false,
   },
   lastField,
  ],
 };

 const c = await ch.getChannel.guildTextChannel('1114105292502859840');
 if (!c) return;

 const messages = await c.messages.fetch({ limit: 100 });
 const lastMessage = messages
  .filter((m) => m.author.id === m.client.user.id)
  .filter((m) => m.createdTimestamp > Date.now() - 3600000);

 if (lastMessage.size) return;

 const msgs = messages.filter((m) => m.author.id === m.client.user.id);
 msgs.forEach((m) => m.delete().catch(() => null));

 c.send({
  embeds: [embed],
 });
};

const location = async (zone: string) => {
 lastField = { name: 'Location', value: zone, inline: false };
};
