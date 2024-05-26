import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author.bot) return;
 if (msg.author.id !== '302050872383242240') return;
 if (!msg.embeds[0]?.description?.includes(':thumbsup:')) return;

 disboardSent(msg);
};

const disboardSent = async (msg: Discord.Message<true>) => {
 client.util.cache.disboardBumpReminders.delete(msg.guildId);

 const settings = await client.util.DataBase.disboard.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 client.util.request.channels.addReaction(
  msg,
  client.util.constants.standard.getEmoteIdentifier(client.util.emotes.tick),
 );

 deleteLastReminder(settings);

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

 await deleteLastReminder(settings);
 const language = await client.util.getLanguage(guild.id);

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
  },
 );

 if (!m || 'message' in m) return;

 if (!settings.repeatenabled) {
  client.util.DataBase.disboard
   .update({
    where: { guildid: guild.id },
    data: {
     msgid: null,
     tempchannelid: null,
     nextbump: null,
    },
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
    data: { msgid: null, tempchannelid: null, channelid: null },
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
