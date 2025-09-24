import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author.bot) return;
 if (msg.author.id !== '302050872383242240') return;
 if (!msg.embeds[0]?.description?.includes('Bump done!')) return;

 disboardSent(msg);
};

export const disboardSent = async (
 msg: Discord.Message<true> | Discord.ButtonInteraction<'cached'>,
) => {
 client.util.cache.disboardBumpReminders.delete(msg.guildId);

 const settings = await client.util.DataBase.disboard.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 deleteLastReminder(settings);

 const nextbump = Date.now() + 9000000;

 client.util.DataBase.disboard
  .update({
   where: {
    guildid: msg.guildId,
   },
   data: {
    nextbump,
    tempchannelid: msg.channelId,
   },
  })
  .then();

 client.util.cache.disboardBumpReminders.set(
  Jobs.scheduleJob(getPathFromError(new Error(msg.guild.id)), new Date(nextbump), () => {
   bumpReminder(msg.guild);
  }),
  msg.guildId,
 );

 if (msg instanceof Discord.ButtonInteraction) return;

 client.util.request.channels.addReaction(
  msg,
  client.util.constants.standard.getEmoteIdentifier(client.util.emotes.tick),
 );

 if (settings.deletereply) {
  Jobs.scheduleJob(
   getPathFromError(new Error(msg.guild.id)),
   new Date(Date.now() + 5000),
   async () => {
    if (!msg) return;
    if (await client.util.isDeleteable(msg)) client.util.request.channels.deleteMessage(msg);
   },
  );
 }
};

export const bumpReminder = async (guild: Discord.Guild, cacheSettings?: Prisma.disboard) => {
 client.util.cache.disboardBumpReminders.delete(guild.id);

 const settings =
  cacheSettings ??
  (await client.util.DataBase.disboard.findUnique({
   where: { guildid: guild.id, active: true },
  }));
 if (!settings) return;
 if (!settings.channelid && !settings.tempchannelid) return;

 if (settings.channelid && !guild.client.channels.cache.get(settings.channelid)) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: settings.guildid },
    data: { msgid: null, channelid: null },
   })
   .then();
 }

 await deleteLastReminder(settings);
 const language = await client.util.getLanguage(guild.id);

 const getComponents = (
  disabled: boolean = true,
 ): Discord.APIActionRowComponent<Discord.APIButtonComponentWithCustomId>[] => [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Secondary,
     label: language.events.ready.disboard.button,
     custom_id: 'disboard/bump',
     disabled,
    },
   ],
  },
 ];

 const m = await client.util.send(
  { id: (settings.channelid ?? settings.tempchannelid) as string, guildId: guild.id },
  {
   content: `${settings.roles.map((r) => `<@&${r}>`).join(' ')}\n${settings.users
    .map((u) => `<@${u}>`)
    .join(' ')}`,
   allowed_mentions: { roles: settings.roles },
   embeds: [
    {
     author: {
      name: language.events.ready.disboard.title,
      icon_url: (await client.util.getUser('302050872383242240'))?.displayAvatarURL(),
     },
     description: language.events.ready.disboard.desc,
    },
   ],
   components: getComponents(),
  },
 );

 if (!m || 'message' in m) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: settings.guildid },
    data: { msgid: null, tempchannelid: null, nextbump: null },
   })
   .then();
  return;
 }

 Jobs.scheduleJob(client.util.getPathFromError(new Error()), new Date(Date.now() + 60000), () => {
  if (!m.channel.messages.cache.get(m.id)) return;
  client.util.request.channels.editMsg(m as Discord.Message<true>, {
   components: getComponents(false),
  });
 });

 if (!settings.repeatenabled) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: guild.id },
    data: { msgid: null, tempchannelid: null, nextbump: null },
   })
   .then();
  return;
 }

 const nextbump = Date.now() + Number(settings.repeatreminder) * 1000;

 client.util.DataBase.disboard
  .update({
   where: { guildid: guild.id },
   data: {
    msgid: m.id,
    tempchannelid: m.channelId,
    nextbump,
   },
  })
  .then();

 client.util.cache.disboardBumpReminders.set(
  Jobs.scheduleJob(getPathFromError(new Error(guild.id)), new Date(nextbump), () => {
   bumpReminder(guild);
  }),
  guild.id,
 );
};

const deleteLastReminder = async (settings: Prisma.disboard) => {
 if (!settings.tempchannelid || !settings.msgid) return;

 const channel = await client.util.getChannel.guildTextChannel(settings.tempchannelid);

 if (!channel) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: settings.guildid },
    data: { msgid: null, tempchannelid: null },
   })
   .then();
  return;
 }

 const m = channel
  ? await client.util.request.channels
     .getMessage(channel, settings.msgid)
     .then((ms) => ('message' in ms ? undefined : ms))
  : undefined;

 if (m && (await client.util.isDeleteable(m))) client.util.request.channels.deleteMessage(m);
};
