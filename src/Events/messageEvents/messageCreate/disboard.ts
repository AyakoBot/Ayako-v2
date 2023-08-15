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

 msg.react(ch.stringEmotes.tick).catch(() => undefined);

 deleteLastReminder(settings, msg.guild);

 if (settings.deletereply && msg.deletable) {
  Jobs.scheduleJob(new Date(Date.now() + 5000), () => {
   if (msg && msg.deletable) msg.delete().catch(() => undefined);
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

 await deleteLastReminder(settings, guild);
 const language = await ch.languageSelector(guild.id);

 const m = await ch.send(
  { id: (settings.channelid ?? settings.tempchannelid) as string, guildId: guild.id },
  {
   content: `${settings.roles.map((r) => `<@&${r}>`).join(' ')}\n${settings.users
    .map((u) => `<@${u}>`)
    .join(' ')}`,
   allowedMentions: {
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

const deleteLastReminder = async (settings: Prisma.disboard, guild: Discord.Guild) => {
 if (!settings.tempchannelid || !settings.msgid) return;

 const m = await (
  guild.channels.cache.get(settings.tempchannelid) as Discord.GuildTextBasedChannel
 )?.messages
  .fetch(settings.msgid)
  .catch(() => undefined);

 if (!m?.deletable) return;
 m.delete().catch(() => undefined);
};
