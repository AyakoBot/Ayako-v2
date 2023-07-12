import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import { giveawayCollectTimeExpired, end } from '../../../Commands/SlashCommands/giveaway/end.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default () => {
 client.guilds.cache.forEach(async (guild) => {
  guild.commands.fetch().catch(() => undefined);
  await guild.members.fetch().catch(() => undefined);
  await ch.cache.commandPermissions.get(guild.id, '');
  await ch.cache.webhooks.get('', '', guild.id);

  if (guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
   ch.cache.invites.get('', '', guild.id);
   ch.cache.integrations.get('', guild.id);
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

  guild.channels.cache.forEach(async (c) => {
   if (!c.isTextBased()) return;

   const pins = await c.messages.fetchPinned().catch(() => undefined);
   pins?.forEach((pin) => ch.cache.pins.set(pin));
  });

  if (guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
   ch.cache.welcomeScreens.get(guild.id);
  }

  const scheduledEvents = await guild.scheduledEvents.fetch().catch(() => undefined);
  scheduledEvents?.forEach(async (event) => {
   const users = await event.fetchSubscribers().catch(() => undefined);
   users?.forEach((u) => {
    ch.cache.scheduledEventUsers.add(u.user, guild.id, event.id);
   });
  });

  if (guild.members.me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
   await guild.autoModerationRules.fetch().catch(() => undefined);
  }

  const claimTimeouts = await ch.query(
   `SELECT * FROM giveawaycollection WHERE guildId = $1;`,
   [guild.id],
   {
    returnType: 'giveawaycollection',
    asArray: true,
   },
  );

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

  const language = await ch.languageSelector(guild.id);

  (
   [
    { table: 'punish_mutes', cache: ch.cache.mutes, event: 'muteRemove' },
    { table: 'punish_tempbans', cache: ch.cache.bans, event: 'banRemove' },
    { table: 'punish_tempchannelbans', cache: ch.cache.channelBans, event: 'channelBanRemove' },
   ] as const
  ).forEach(async (table) => {
   const punishments = await ch.query(
    `SELECT * FROM ${table.table} WHERE guildid = $1;`,
    [guild.id],
    {
     returnType: table.table,
     asArray: true,
    },
   );

   punishments?.forEach((m) => {
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
        dbOnly: 'banchannelid' in m ? !!guild.channels.cache.get(m.banchannelid) : false,
        channel:
         'banchannelid' in m
          ? (guild.channels.cache.get(m.banchannelid) as Discord.GuildChannel)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const disboard = (_: unknown) => null; // TODO: import disboard handler

  const disboardBumpReminders = await ch.query(
   `SELECT * FROM disboard WHERE guildid = $1;`,
   [guild.id],
   {
    returnType: 'disboard',
    asArray: false,
   },
  );
  if (disboardBumpReminders) disboard(disboardBumpReminders);

  (
   await ch.query(
    `SELECT * FROM giveaways WHERE guildid = $1 AND ended = false AND claimingdone = false;`,
    [guild.id],
    {
     returnType: 'giveaways',
     asArray: true,
    },
   )
  )?.forEach((g) => {
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
 });
};
