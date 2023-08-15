import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import { giveawayCollectTimeExpired, end } from '../../../Commands/SlashCommands/giveaway/end.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { deleteThread } from '../../../BaseClient/ClientHelperModules/mod.js';
import { bumpReminder } from '../../messageEvents/messageCreate/disboard.js';

export default () => {
 client.guilds.cache.forEach(async (guild) => {
  Object.values(tasks).forEach((t) => t(guild));
 });
};

export const tasks = {
 disboard: async (guild: Discord.Guild) => {
  const disboardBumpReminders = await ch.DataBase.disboard.findUnique({
   where: { guildid: guild.id },
  });
  if (disboardBumpReminders) {
   ch.cache.disboardBumpReminders.set(
    Jobs.scheduleJob(
     new Date(
      Number(disboardBumpReminders.nextbump) < Date.now()
       ? Date.now() + 10000
       : Number(disboardBumpReminders.nextbump),
     ),
     () => {
      bumpReminder(guild);
     },
    ),
    disboardBumpReminders.guildid,
   );
  }
 },
 giveaways: async (guild: Discord.Guild) => {
  const giveaways = await ch.DataBase.giveaways.findMany({
   where: {
    guildid: guild.id,
    ended: false,
    claimingdone: false,
   },
  });

  giveaways.forEach((g) => {
   ch.cache.giveaways.set(
    Jobs.scheduleJob(
     new Date(Number(g.endtime) < Date.now() ? Date.now() + 10000 : Number(g.endtime)),
     () => {
      end(g);
     },
    ),
    g.guildid,
    g.channelid,
    g.msgid,
   );
  });
 },
 punishments: async (guild: Discord.Guild) => {
  const language = await ch.languageSelector(guild.id);
  const where = { where: { guildid: guild.id } };
  const tables = [
   {
    rows: () => ch.DataBase.punish_mutes.findMany(where),
    cache: ch.cache.mutes,
    event: 'muteRemove',
   },
   {
    rows: () => ch.DataBase.punish_tempbans.findMany(where),
    cache: ch.cache.bans,
    event: 'banRemove',
   },
   {
    rows: () => ch.DataBase.punish_tempchannelbans.findMany(where),
    cache: ch.cache.channelBans,
    event: 'channelBanRemove',
   },
  ] as const;

  tables.forEach(async (table) => {
   (await table.rows()).forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);

    table.cache.set(
     Jobs.scheduleJob(new Date(Date.now() < time ? 1000 : time), async () => {
      const target = m.userid ? await ch.getUser(m.userid).catch(() => undefined) : undefined;
      if (!target) {
       ch.error(guild, new Error(`Could not find user to initialize ${table}Remove event.`));
       return;
      }

      ch.mod(
       m.msgid && m.channelid
        ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages
           .fetch(m.msgid)
           .catch(() => undefined)
        : undefined,
       table.event,
       {
        executor: m.executorid ? await ch.getUser(m.executorid).catch(() => undefined) : undefined,
        target,
        reason: m.reason ?? language.None,
        guild,
        forceFinish: true,
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
       } as CT.ModOptions<'channelBanRemove' | 'banRemove' | 'muteRemove'>,
      );
     }),
     guild.id,
     'banchannelid' in m ? m.channelid : m.userid,
     m.userid,
    );
   });
  });
 },
 claimTimeouts: async (guild: Discord.Guild) => {
  const claimTimeouts = await ch.DataBase.giveawaycollection.findMany({
   where: { guildid: guild.id },
  });
  claimTimeouts?.forEach((t) => {
   ch.cache.giveawayClaimTimeout.set(
    Jobs.scheduleJob(
     new Date(Number(t.endtime) < Date.now() ? Date.now() + 10000 : Number(t.endtime)),
     () => {
      giveawayCollectTimeExpired(t.msgid, t.guildid);
     },
    ),
    t.guildid,
    t.msgid,
   );
  });
 },
 deleteThreads: async (guild: Discord.Guild) => {
  if (!guild.rulesChannel) return;
  const deleteThreads = await ch.DataBase.deletethreads.findMany({
   where: { guildid: guild.id },
  });
  deleteThreads?.forEach((t) => {
   ch.cache.deleteThreads.set(
    Jobs.scheduleJob(
     new Date(Number(t.deletetime) < Date.now() ? Date.now() + 10000 : Number(t.deletetime)),
     () => {
      deleteThread(guild, t.channelid);
     },
    ),
    t.guildid,
    t.channelid,
   );
  });
 },
 autoModRules: async (guild: Discord.Guild) => {
  if (guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
   await guild.autoModerationRules.fetch().catch(() => undefined);
  }
 },
 scheduledEvents: async (guild: Discord.Guild) => {
  const scheduledEvents = await guild.scheduledEvents.fetch().catch(() => undefined);
  scheduledEvents?.forEach(async (event) => {
   const users = await event.fetchSubscribers().catch(() => undefined);
   users?.forEach((u) => {
    ch.cache.scheduledEventUsers.add(u.user, guild.id, event.id);
   });
  });
 },
 welcomeScreen: async (guild: Discord.Guild) => {
  if (guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
   ch.cache.welcomeScreens.get(guild.id);
  }
 },
 pins: async (guild: Discord.Guild) => {
  guild.channels.cache.forEach(async (c) => {
   if (!c.isTextBased()) return;

   const pins = await c.messages.fetchPinned().catch(() => undefined);
   pins?.forEach((pin) => ch.cache.pins.set(pin));
  });
 },
 invites: async (guild: Discord.Guild) => {
  if (guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
   ch.cache.invites.get('', '', guild.id);
  }

  const vanity = guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)
   ? await guild.fetchVanityData().catch(() => undefined)
   : undefined;
  if (vanity) {
   const invite = vanity as Discord.Invite;
   invite.channel = (guild.channels.cache.get(guild.id) ??
    guild.channels.cache.first()) as Discord.NonThreadGuildBasedChannel;
   invite.channelId = invite.channel?.id;

   ch.cache.invites.set(invite, guild.id);
  }
 },
 integrations: async (guild: Discord.Guild) => {
  if (guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
   ch.cache.integrations.get('', guild.id);
  }
 },
 commands: async (guild: Discord.Guild) => {
  guild.commands.fetch().catch(() => undefined);
 },
 members: async (guild: Discord.Guild) => {
  guild.members.fetch().catch(() => undefined);
 },
 commandPermissions: async (guild: Discord.Guild) => {
  await ch.cache.commandPermissions.get(guild.id, '');
 },
 webhooks: async (guild: Discord.Guild) => {
  await ch.cache.webhooks.get('', '', guild.id);
 },
};
