import type * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (guild: Discord.Guild) => {
 guild.members.fetch();
 const language = await ch.languageSelector(guild.id);

 const invites = await guild.invites.fetch();
 invites.forEach((i) => ch.cache.invites.set(i, guild.id));

 const vanity = await guild.fetchVanityData().catch(() => undefined);
 if (vanity) {
  const invite = vanity as Discord.Invite;
  invite.channel = (guild.channels.cache.get(guild.id) ??
   guild.channels.cache.first()) as Discord.NonThreadGuildBasedChannel;
  invite.channelId = invite.channel?.id;

  ch.cache.invites.set(invite, guild.id);
 }

 guild.channels.cache.forEach(async (channel) => {
  const webhooks = await guild.channels.fetchWebhooks(channel);
  webhooks.forEach((w) => {
   ch.cache.webhooks.set(w);
  });
 });

 guild.channels.cache.forEach(async (c) => {
  if (!c.isTextBased()) return;

  const pins = await c.messages.fetchPinned();
  pins.forEach((pin) => ch.cache.pins.set(pin));
 });

 const welcomeScreen = await guild.fetchWelcomeScreen();
 ch.cache.welcomeScreens.set(welcomeScreen);

 const intergrations = await guild.fetchIntegrations();
 intergrations.forEach((i) => {
  ch.cache.integrations.set(i, guild.id);
 });

 const scheduledEvents = await guild.scheduledEvents.fetch();
 scheduledEvents.forEach(async (event) => {
  const users = await event.fetchSubscribers();
  users.forEach((u) => {
   ch.cache.scheduledEventUsers.add(u.user, guild.id, event.id);
  });
 });

 await guild.autoModerationRules.fetch().catch(() => undefined);

 const claimTimeouts = await ch.query(
  `SELECT * FROM giveawaycollecttime WHERE guildId = $1;`,
  [String(guild.id)],
  {
   returnType: 'giveawaycollecttime',
   asArray: true,
  },
 );

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const giveawayCollectTimeoutFunction = (_: unknown) => null; // TODO: import from resolver
 claimTimeouts?.forEach((t) => giveawayCollectTimeoutFunction(t));

 const mutes = await ch.query(`SELECT * FROM punish_tempmutes WHERE guildid = $1;`, [guild.id], {
  returnType: 'punish_tempmutes',
  asArray: true,
 });
 mutes?.forEach((m) => {
  const time = Number(m.uniquetimestamp) + Number(m.duration);
  ch.cache.mutes.set(
   Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
    const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
    if (!target) return;

    ch.mod(
     m.msgid && m.channelid
      ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages
         .fetch(m.msgid)
         .catch(() => undefined)
      : undefined,
     'muteRemove',
     {
      executor: m.executorid ? await ch.getUser(m.executorid).catch(() => undefined) : undefined,
      target,
      reason: m.reason ?? language.None,
      guild,
      forceFinish: true,
      dbOnly: false,
     },
    );
   }),
   guild.id,
   m.userid,
  );
 });

 const bans = await ch.query(`SELECT * FROM punish_tempbans WHERE guildid = $1;`, [guild.id], {
  returnType: 'punish_tempbans',
  asArray: true,
 });
 bans?.forEach((m) => {
  const time = Number(m.uniquetimestamp) + Number(m.duration);
  ch.cache.mutes.set(
   Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
    const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
    if (!target) return;

    ch.mod(
     m.msgid && m.channelid
      ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages
         .fetch(m.msgid)
         .catch(() => undefined)
      : undefined,
     'banRemove',
     {
      executor: m.executorid ? await ch.getUser(m.executorid).catch(() => undefined) : undefined,
      target,
      reason: m.reason ?? language.None,
      guild,
      forceFinish: true,
      dbOnly: false,
     },
    );
   }),
   guild.id,
   m.userid,
  );
 });

 const channelBans = await ch.query(
  `SELECT * FROM punish_tempchannelbans WHERE guildid = $1;`,
  [guild.id],
  {
   returnType: 'punish_tempchannelbans',
   asArray: true,
  },
 );
 channelBans?.forEach((m) => {
  const time = Number(m.uniquetimestamp) + Number(m.duration);
  ch.cache.mutes.set(
   Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
    const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
    if (!target) return;

    ch.mod(
     m.msgid && m.channelid
      ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages
         .fetch(m.msgid)
         .catch(() => undefined)
      : undefined,
     'banRemove',
     {
      executor: m.executorid ? await ch.getUser(m.executorid).catch(() => undefined) : undefined,
      target,
      reason: m.reason ?? language.None,
      guild,
      forceFinish: true,
      dbOnly: false,
     },
    );
   }),
   guild.id,
   m.userid,
  );
 });

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const disboard = (_: unknown) => null; // TODO: import disboard handler

 const disboardBumpReminders = await ch.query(
  `SELECT * FROM disboard WHERE guildid = $1;`,
  [String(guild.id)],
  {
   returnType: 'disboard',
   asArray: false,
  },
 );
 if (disboardBumpReminders) disboard(disboardBumpReminders);

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const giveawayEnd = (_: unknown) => null; // TODO: import giveaway handler

 const giveaways = await ch.query(
  `SELECT * FROM giveaways WHERE guildid = $1;`,
  [String(guild.id)],
  {
   returnType: 'disboard',
   asArray: true,
  },
 );
 giveaways?.forEach((g) => giveawayEnd(g));
};
