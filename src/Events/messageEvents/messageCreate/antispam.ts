import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import { performPunishment } from './antivirus.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author) return;
 if (msg.author.bot) return;

 if (msg.author.id !== '564052925828038658') return;

 const settings = await msg.client.util.DataBase.antispam.findUnique({
  where: {
   guildid: msg.guildId,
   active: true,
   forcedisabled: false,
  },
 });
 if (!settings) return;

 if (settings.wluserid.includes(msg.author.id)) return;
 if (settings.wlroleid.some((r) => msg.member?.roles.cache.has(r))) return;
 if (settings.wlchannelid.includes(msg.channelId)) return;

 if (!msg.client.util.cache.antispam.get(msg.author.id)) {
  msg.client.util.cache.antispam.set(msg.author.id, []);
 }

 const sentMessages = msg.client.util.cache.antispam.get(msg.author.id);
 if (!sentMessages) return;

 const duplicates = sentMessages.filter((m) => m.content === msg.content);

 let violatesThreshold = false;
 if (Number(duplicates.length) >= Number(settings.dupemsgthreshold)) violatesThreshold = true;
 if (Number(sentMessages.length) >= Number(settings.msgthreshold)) violatesThreshold = true;

 sentMessages?.push(msg);

 Jobs.scheduleJob(new Date(Date.now() + Number(settings.timeout) * 1000), () => {
  const sent = msg.client.util.cache.antispam.get(msg.author.id);
  if (!sent) return;

  const replace = sent.filter((m) => m.id !== msg.id);
  msg.client.util.cache.antispam.set(msg.author.id, replace);
 });

 if (!violatesThreshold) return;

 if (settings.deletespam) {
  const channels = [...new Set(sentMessages.map((m) => m.channelId))]
   .map((id) => sentMessages.find((m) => m.channelId === id)?.channel)
   .filter((c): c is Discord.GuildTextBasedChannel => !!c)
   .map((c) => ({
    channel: c,
    messages: sentMessages.filter((m) => m.channelId === c.id),
   }));

  channels.forEach(async (c) => {
   const messages = (await Promise.all(c.messages.map((m) => msg.client.util.isDeleteable(m))))
    .map((m, i) => (m ? c.messages[i] : undefined))
    .filter((m): m is Discord.Message<true> => !!m);

   msg.client.util.request.channels.bulkDelete(
    c.channel,
    messages.map((m) => m.id),
   );
  });
 }

 const language = await msg.client.util.getLanguage(msg.guildId);
 performPunishment(settings.deletespam ? undefined : msg, settings, language, msg);
};
