import type * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import type DBT from '../../../Typings/DataBaseTypings';
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

  const claimTimeouts = await ch
    .query(`SELECT * FROM giveawaycollecttime WHERE guildId = $1;`, [String(guild.id)])
    .then((r: DBT.giveawaycollecttime[] | null) => r || null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const giveawayCollectTimeoutFunction = (_: unknown) => null; // TODO: import from resolver
  claimTimeouts?.forEach((t) => giveawayCollectTimeoutFunction(t));

  const modBaseEvent = (await import('../../modBaseEvent.js')).default;

  const mutes = await ch
    .query(`SELECT * FROM punish_tempmutes WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.punish_tempmutes[] | null) => r || null);
  mutes?.forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);
    ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
        if (!target) return;

        modBaseEvent({
          executor: m.executorid ? await ch.getUser(m.executorid) : undefined,
          target,
          reason: m.reason ?? language.None,
          msg:
            m.msgid && m.channelid
              ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages.fetch(m.msgid)
              : undefined,
          guild,
          type: 'muteRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      m.userid,
    );
  });

  const bans = await ch
    .query(`SELECT * FROM punish_tempbans WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.punish_tempbans[] | null) => r || null);
  bans?.forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);
    ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
        if (!target) return;

        modBaseEvent({
          executor: m.executorid ? await ch.getUser(m.executorid) : undefined,
          target,
          reason: m.reason ?? language.None,
          msg:
            m.msgid && m.channelid
              ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages.fetch(m.msgid)
              : undefined,
          guild,
          type: 'banRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      m.userid,
    );
  });

  const channelBans = await ch
    .query(`SELECT * FROM punish_tempchannelbans WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.punish_tempchannelbans[] | null) => r || null);
  channelBans?.forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);
    ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        const target = m.userid ? (await ch.getUser(m.userid)) ?? client.user : client.user;
        if (!target) return;

        modBaseEvent({
          executor: m.executorid ? await ch.getUser(m.executorid) : undefined,
          target,
          reason: m.reason ?? language.None,
          msg:
            m.msgid && m.channelid
              ? await (await ch.getChannel.guildTextChannel(m.channelid))?.messages.fetch(m.msgid)
              : undefined,
          guild,
          type: 'channelbanRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      m.userid,
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const disboard = (_: unknown) => null; // TODO: import disboard handler

  const disboardBumpReminders = await ch
    .query(`SELECT * FROM disboard WHERE guildid = $1;`, [String(guild.id)])
    .then((r: DBT.disboard[] | null) => (r ? r[0] : null));
  if (disboardBumpReminders) disboard(disboardBumpReminders);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const giveawayEnd = (_: unknown) => null; // TODO: import giveaway handler

  const giveaways = await ch
    .query(`SELECT * FROM giveaways WHERE guildid = $1;`, [String(guild.id)])
    .then((r: DBT.giveaways[] | null) => r || null);
  giveaways?.forEach((g) => giveawayEnd(g));
};
