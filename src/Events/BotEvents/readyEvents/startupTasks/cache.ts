import { BaseMessage } from 'discord-hybrid-sharding';
import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import { endDeleteSuggestion } from '../../../../Commands/ModalCommands/suggestion/accept.js';
import {
 end as endGiveaway,
 giveawayCollectTimeExpired,
} from '../../../../Commands/SlashCommands/giveaway/end.js';
import { end as endReminder } from '../../../../Commands/SlashCommands/reminder/create.js';
import * as CT from '../../../../Typings/Typings.js';
import { end as endVote } from '../../../ClusterEvents/voteEvents/voteBotCreate.js';
import appeal from '../../../ClusterEvents/appeal.js';
import { enableInvites } from '../../guildEvents/guildMemberAdd/antiraid.js';
import { bumpReminder } from '../../messageEvents/messageCreate/disboard.js';
import { del } from '../../voiceStateEvents/voiceStateDeletes/voiceHub.js';

export default () => {
 const gIds = client.guilds.cache.map((g) => g.id);
 Object.values(startupTasks).forEach((t) => t(gIds));
};

export const startupTasks = {
 appeals: async (gIds: string[]) => {
  const appeals = await client.util.DataBase.appeals.findMany({
   where: { guildid: { in: gIds }, received: false },
  });

  appeals.forEach((a) => {
   appeal(
    new BaseMessage({
     type: CT.MessageType.Appeal,
     appeal: { userId: a.userid, guildId: a.guildid, punishmentId: a.punishmentid },
    }) as CT.AppealMessage,
   );
  });
 },
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 reminder: async (_: string[]) => {
  if (client.user?.id !== process.env.mainId) return;
  const reminders = await client.util.DataBase.reminders.findMany({ where: {} });

  reminders.forEach((r) => {
   client.util.cache.reminders.set(
    Jobs.scheduleJob(
     getPathFromError(new Error(String(r.uniquetimestamp))),
     new Date(Number(r.endtime) < Date.now() ? Date.now() + 10000 : Number(r.endtime)),
     () => {
      endReminder(r);
     },
    ),
    r.userid,
    Number(r.endtime),
   );
  });
 },
 vote: async (gIds: string[]) => {
  const votes = await client.util.DataBase.votes.findMany({
   where: { guildid: { in: gIds } },
  });

  votes.forEach((vote) => {
   const guild = client.guilds.cache.get(vote.guildid);
   if (!guild) return;

   tasks.vote(vote, guild);
  });
 },
 vcDeleteTimeouts: async (gIds: string[]) => {
  const settings = await client.util.DataBase.voicehubs.findMany({
   where: { guildid: { in: gIds } },
  });

  const vcs = await client.util.DataBase.voicechannels.findMany({
   where: { guildid: { in: gIds } },
  });

  vcs.forEach(async (vc) => {
   const guild = client.guilds.cache.get(vc.guildid);
   if (!guild) return;

   const setting = settings.find((s) => s.guildid === guild.id);

   tasks.vcDeleteTimeouts(vc, setting, guild);
  });
 },
 deleteSuggestions: async (gIds: string[]) => {
  const setting = await client.util.DataBase.suggestionsettings.findMany({
   where: {
    guildid: { in: gIds },
    active: true,
    OR: [{ deleteapproved: true }, { deletedenied: true }],
   },
  });
  if (!setting) return;

  const suggestions = await client.util.DataBase.suggestionvotes.findMany({
   where: { guildid: { in: gIds } },
  });

  suggestions.forEach((s) => {
   const guild = client.guilds.cache.get(s.guildid);
   if (!guild) return;

   const settings = setting.find((se) => se.guildid === guild.id);
   if (!settings) return;

   tasks.deleteSuggestions(s, settings, guild);
  });
 },
 disboard: async (gIds: string[]) => {
  const settings = await client.util.DataBase.disboard.findMany({
   where: { guildid: { in: gIds }, nextbump: { not: null } },
  });
  if (!settings) return;

  settings.forEach((s) => {
   const guild = client.guilds.cache.get(s.guildid);
   if (!guild) return;

   tasks.disboard(s, guild);
  });
 },
 giveaways: async (gIds: string[]) => {
  const giveaways = await client.util.DataBase.giveaways.findMany({
   where: {
    guildid: { in: gIds },
    ended: false,
    claimingdone: false,
   },
  });

  giveaways.forEach((g) => {
   tasks.giveaways(g);
  });
 },
 punishments: async (gIds: string[]) => {
  const where = { where: { guildid: { in: gIds } } };
  const tables = [
   {
    rows: () => client.util.DataBase.punish_mutes.findMany(where),
    cache: client.util.cache.mutes,
    event: CT.ModTypes.MuteRemove,
   },
   {
    rows: () => client.util.DataBase.punish_tempbans.findMany(where),
    cache: client.util.cache.bans,
    event: CT.ModTypes.BanRemove,
   },
   {
    rows: () => client.util.DataBase.punish_tempchannelbans.findMany(where),
    cache: client.util.cache.channelBans,
    event: CT.ModTypes.ChannelBanRemove,
   },
  ] as const;

  tables.forEach(async (table) => {
   (await table.rows()).forEach((m) => {
    const guild = client.guilds.cache.get(m.guildid);
    if (!guild) return;

    tasks.punishments(table, m, guild);
   });
  });
 },
 claimTimeouts: async (gIds: string[]) => {
  const claimTimeouts = await client.util.DataBase.giveawaycollection.findMany({
   where: { guildid: { in: gIds } },
  });

  claimTimeouts?.forEach((t) => {
   const guild = client.guilds.cache.get(t.guildid);
   if (!guild) return;

   tasks.claimTimeouts(t, guild);
  });
 },
 enableInvites: async (gIds: string[]) => {
  const settings = await client.util.DataBase.guildsettings.findMany({
   where: { guildid: { in: gIds }, enableinvitesat: { not: null } },
  });
  if (!settings) return;

  settings.forEach((s) => {
   const guild = client.guilds.cache.get(s.guildid);
   if (!guild) return;

   tasks.enableInvites(s, guild);
  });
 },
};

const tasks = {
 vote: (vote: Prisma.votes, guild: Discord.Guild) => {
  client.util.cache.votes.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(String(vote.endtime))),

    new Date(Date.now() > Number(vote.endtime) ? Date.now() + 10000 : Number(vote.endtime)),
    () => {
     endVote(vote, guild);
    },
   ),
   guild.id,
   vote.voted,
   vote.userid,
  );
 },
 vcDeleteTimeouts: async (
  vc: Prisma.voicechannels,
  applyingSetting: Prisma.voicehubs | undefined,
  guild: Discord.Guild,
 ) => {
  const delDB = () =>
   client.util.DataBase.voicechannels
    .delete({ where: { guildid_channelid: { guildid: vc.guildid, channelid: vc.channelid } } })
    .then();

  if (!applyingSetting) {
   delDB();
   return;
  }

  const channel = await client.util.getChannel.guildVoiceChannel(vc.channelid);
  if (!channel) {
   delDB();
   return;
  }

  if (channel.members.size) return;

  if (!vc.everyonelefttime) {
   client.util.DataBase.voicechannels
    .update({
     where: { guildid_channelid: { guildid: guild.id, channelid: channel.id } },
     data: { everyonelefttime: Date.now() },
    })
    .then();
  }

  client.util.cache.vcDeleteTimeout.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(vc.channelid)),
    new Date(Date.now() + Number(applyingSetting.deletetime) * 1000),
    () => del(channel),
   ),
   guild.id,
   channel.id,
  );
 },
 deleteSuggestions: (
  s: Prisma.suggestionvotes,
  settings: Prisma.suggestionsettings,
  guild: Discord.Guild,
 ) => {
  client.util.cache.deleteSuggestions.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(s.msgid)),

    new Date(
     Date.now() +
      (s.approved ? Number(settings.deleteapprovedafter) : Number(settings.deletedeniedafter)) *
       1000,
    ),
    async () => {
     endDeleteSuggestion(s);
    },
   ),
   guild.id,
   s.msgid,
  );
 },
 disboard: (s: Prisma.disboard, guild: Discord.Guild) => {
  client.util.cache.disboardBumpReminders.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(guild.id)),

    new Date(Number(s.nextbump) < Date.now() ? Date.now() + 10000 : Number(s.nextbump)),
    () => {
     bumpReminder(guild);
    },
   ),
   s.guildid,
  );
 },
 giveaways: (g: Prisma.giveaways) => {
  client.util.cache.giveaways.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(g.msgid)),

    new Date(Number(g.endtime) < Date.now() ? Date.now() + 10000 : Number(g.endtime)),
    () => {
     endGiveaway(g);
    },
   ),
   g.guildid,
   g.channelid,
   g.msgid,
  );
 },
 punishments: (
  table:
   | {
      rows: () => Prisma.Prisma.PrismaPromise<Prisma.punish_mutes[]>;
      cache: typeof client.util.cache.mutes;
      event: CT.ModTypes.MuteRemove;
     }
   | {
      rows: () => Prisma.Prisma.PrismaPromise<Prisma.punish_tempbans[]>;
      cache: typeof client.util.cache.bans;
      event: CT.ModTypes.BanRemove;
     }
   | {
      rows: () => Prisma.Prisma.PrismaPromise<Prisma.punish_tempchannelbans[]>;
      cache: typeof client.util.cache.channelBans;
      event: CT.ModTypes.ChannelBanRemove;
     },
  m: Prisma.punish_tempchannelbans | Prisma.punish_tempbans | Prisma.punish_mutes,
  guild: Discord.Guild,
 ) => {
  const time = Number(m.uniquetimestamp) + Number(m.duration) * 1000;

  table.cache.set(
   Jobs.scheduleJob(
    getPathFromError(new Error()),
    new Date(Date.now() < time ? 1000 : time),
    async () => {
     const target = m.userid
      ? await client.util.getUser(m.userid).catch(() => undefined)
      : undefined;

     if (!target) {
      client.util.error(
       guild,
       new Error(`Could not find user to initialize ${table}Remove event.`),
      );
      return;
     }

     const channel = await client.util.getChannel.guildTextChannel(m.channelid);

     client.util.mod(
      m.msgid && channel
       ? await client.util.request.channels
          .getMessage(channel, m.msgid)
          .then((s) => ('message' in s ? undefined : s))
       : undefined,
      table.event,
      {
       executor: m.executorid
        ? await client.util.getUser(m.executorid).catch(() => undefined)
        : undefined,
       target,
       reason: m.reason ?? '-',
       guild,
       skipChecks: true,
       dbOnly:
        'banchannelid' in m
         ? !!guild.channels.cache.get((m as Prisma.punish_tempchannelbans).banchannelid)
         : false,
       channel:
        'banchannelid' in m
         ? (guild.channels.cache.get(
            (m as Prisma.punish_tempchannelbans).banchannelid,
           ) as Discord.GuildChannel)
         : undefined,
      } as CT.ModOptions<
       CT.ModTypes.ChannelBanRemove | CT.ModTypes.BanRemove | CT.ModTypes.MuteRemove
      >,
     );
    },
   ),
   guild.id,
   'banchannelid' in m ? m.channelid : m.userid,
   m.userid,
  );
 },
 claimTimeouts: (t: Prisma.giveawaycollection, guild: Discord.Guild) => {
  client.util.cache.giveawayClaimTimeout.set(
   Jobs.scheduleJob(
    getPathFromError(new Error(guild.id)),
    new Date(Number(t.endtime) < Date.now() ? Date.now() + 10000 : Number(t.endtime)),
    () => {
     giveawayCollectTimeExpired(t.msgid, t.guildid);
    },
   ),
   t.guildid,
   t.msgid,
  );
 },
 enableInvites: (s: Prisma.guildsettings, guild: Discord.Guild) => {
  client.util.cache.enableInvites.set(
   guild.id,
   Jobs.scheduleJob(
    getPathFromError(new Error(guild.id)),
    new Date(Number(s.enableinvitesat)),
    () => {
     enableInvites(guild);
    },
   ),
  );
 },
};
