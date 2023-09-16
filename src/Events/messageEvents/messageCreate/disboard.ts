import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author.bot) return;
 if (msg.author.id !== '302050872383242240') return;
 if (!msg.embeds[0]?.description?.includes(':thumbsup:')) return;

 disboardSent(msg);
};

const disboardSent = async (msg: Discord.Message<true>) => {
 ch.cache.disboardBumpReminders.delete(msg.guildId);

 const settings = await ch.DataBase.disboard.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 ch.request.channels.addReaction(msg, `${ch.objectEmotes.tick.name}:${ch.objectEmotes.tick.id}`);

 deleteLastReminder(settings);

 if (settings.deletereply) {
  Jobs.scheduleJob(new Date(Date.now() + 5000), async () => {
   if (!msg) return;
   if (await ch.isDeleteable(msg)) ch.request.channels.deleteMessage(msg);
  });
 }

 const nextbump = Date.now() + 9000000;

 ch.DataBase.disboard
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

 ch.cache.disboardBumpReminders.set(
  Jobs.scheduleJob(new Date(nextbump), () => {
   bumpReminder(msg.guild);
  }),
  msg.guildId,
 );
};

export const bumpReminder = async (guild: Discord.Guild, cacheSettings?: Prisma.disboard) => {
 ch.cache.disboardBumpReminders.delete(guild.id);

 const settings =
  cacheSettings ??
  (await ch.DataBase.disboard.findUnique({
   where: { guildid: guild.id, active: true },
  }));
 if (!settings) return;
 if (!settings.channelid && !settings.tempchannelid) return;

 await deleteLastReminder(settings);
 const language = await ch.languageSelector(guild.id);

 const m = await ch.send(
  { id: (settings.channelid ?? settings.tempchannelid) as string, guildId: guild.id },
  {
   content: `${settings.roles.map((r) => `<@&${r}>`).join(' ')}\n${settings.users
    .map((u) => `<@${u}>`)
    .join(' ')}`,
   allowed_mentions: {
    roles: settings.roles,
    users: settings.users,
   },
   embeds: [
    {
     author: {
      name: language.events.ready.disboard.title,
      icon_url: (await guild.client.users.fetch('302050872383242240')).displayAvatarURL(),
     },
     description: language.events.ready.disboard.desc,
    },
   ],
  },
 );

 if (!m) return;

 ch.DataBase.disboard
  .update({
   where: {
    guildid: guild.id,
   },
   data: {
    msgid: m.id,
    tempchannelid: m.channelId,
    nextbump: settings.repeatenabled
     ? Date.now() + settings.repeatreminder.toNumber() * 1000
     : undefined,
   },
  })
  .then();

 if (settings.repeatenabled) {
  ch.cache.disboardBumpReminders.set(
   Jobs.scheduleJob(new Date(Date.now() + settings.repeatreminder.toNumber() * 1000), () => {
    bumpReminder(guild);
   }),
   guild.id,
  );
 }
};

const deleteLastReminder = async (settings: Prisma.disboard) => {
 if (!settings.tempchannelid || !settings.msgid) return;

 const channel = await ch.getChannel.guildTextChannel(settings.tempchannelid);

 const m = channel
  ? await ch.request.channels
     .getMessage(channel, settings.msgid)
     .then((ms) => ('message' in ms ? undefined : ms))
  : undefined;

 if (m && (await ch.isDeleteable(m))) ch.request.channels.deleteMessage(m);
};
