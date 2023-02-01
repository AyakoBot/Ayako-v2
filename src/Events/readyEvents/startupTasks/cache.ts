import * as Jobs from 'node-schedule';
import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings.js';

// import checks to guildCreate
// cache stuff like welcome screen on change

export default () => {
  client.guilds.cache.forEach(async (guild) => {
    guild.members.fetch().catch(() => undefined);
    const language = await client.ch.languageSelector(guild.id);

    const invites = await guild.invites.fetch();
    invites.forEach((i) => client.cache.invites.set(i, guild.id));

    const vanity = await guild.fetchVanityData().catch(() => undefined);
    if (vanity) {
      const invite = vanity as Discord.Invite;
      invite.channel = (guild.channels.cache.get(guild.id) ??
        guild.channels.cache.first()) as Discord.NonThreadGuildBasedChannel;
      invite.channelId = invite.channel?.id;

      client.cache.invites.set(invite, guild.id);
    }

    guild.channels.cache
      .filter((c) => c.isTextBased())
      .filter((c) => !c.isThread())
      .forEach(async (channel) => {
        const webhooks = await guild.channels.fetchWebhooks(channel).catch(() => undefined);
        webhooks?.forEach((w) => {
          client.cache.webhooks.set(w);
        });
      });

    guild.channels.cache.forEach(async (c) => {
      if (!c.isTextBased()) return;

      const pins = await c.messages.fetchPinned().catch(() => undefined);
      pins?.forEach((pin) => client.cache.pins.set(pin));
    });

    if (guild.features.includes('WELCOME_SCREEN_ENABLED')) {
      const welcomeScreen = await guild.fetchWelcomeScreen().catch(() => undefined);
      if (welcomeScreen) client.cache.welcomeScreens.set(welcomeScreen);
    }

    const intergrations = await guild.fetchIntegrations();
    intergrations.forEach((i) => {
      client.cache.integrations.set(i, guild.id);
    });

    const scheduledEvents = await guild.scheduledEvents.fetch().catch(() => undefined);
    scheduledEvents?.forEach(async (event) => {
      const users = await event.fetchSubscribers().catch(() => undefined);
      users?.forEach((u) => {
        client.cache.scheduledEventUsers.add(u.user, guild.id, event.id);
      });
    });

    const claimTimeouts = await client.ch
      .query(`SELECT * FROM giveawaycollecttime WHERE guildId = $1;`, [String(guild.id)])
      .then((r: DBT.giveawaycollecttime[] | null) => r || null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const giveawayCollectTimeoutFunction = (_: unknown) => null; // TODO: import from resolver
    claimTimeouts?.forEach((t) => giveawayCollectTimeoutFunction(t));

    const modBaseEvent = (await import('../../modBaseEvent.js')).default;

    const mutes = await client.ch
      .query(`SELECT * FROM punish_tempmutes WHERE userid = $1 AND guildid = $2;`)
      .then((r: DBT.punish_tempmutes[] | null) => r || null);
    mutes?.forEach((m) => {
      const time = Number(m.uniquetimestamp) + Number(m.duration);
      client.cache.mutes.set(
        Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
          const target = m.userid
            ? (await client.users.fetch(m.userid).catch(() => undefined)) ?? client.user
            : client.user;
          if (!target) return;

          modBaseEvent({
            executor: m.executorid
              ? await client.users.fetch(m.executorid).catch(() => undefined)
              : undefined,
            target,
            reason: m.reason ?? language.none,
            msg:
              m.msgid && m.channelid
                ? await (await client.ch.getChannel.guildTextChannel(m.channelid))?.messages
                    .fetch(m.msgid)
                    .catch(() => undefined)
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

    const bans = await client.ch
      .query(`SELECT * FROM punish_tempbans WHERE userid = $1 AND guildid = $2;`)
      .then((r: DBT.punish_tempbans[] | null) => r || null);
    bans?.forEach((m) => {
      const time = Number(m.uniquetimestamp) + Number(m.duration);
      client.cache.mutes.set(
        Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
          const target = m.userid
            ? (await client.users.fetch(m.userid).catch(() => undefined)) ?? client.user
            : client.user;
          if (!target) return;

          modBaseEvent({
            executor: m.executorid
              ? await client.users.fetch(m.executorid).catch(() => undefined)
              : undefined,
            target,
            reason: m.reason ?? language.none,
            msg:
              m.msgid && m.channelid
                ? await (await client.ch.getChannel.guildTextChannel(m.channelid))?.messages
                    .fetch(m.msgid)
                    .catch(() => undefined)
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

    const channelBans = await client.ch
      .query(`SELECT * FROM punish_tempchannelbans WHERE userid = $1 AND guildid = $2;`)
      .then((r: DBT.punish_tempchannelbans[] | null) => r || null);
    channelBans?.forEach((m) => {
      const time = Number(m.uniquetimestamp) + Number(m.duration);
      client.cache.mutes.set(
        Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
          const target = m.userid
            ? (await client.users.fetch(m.userid).catch(() => undefined)) ?? client.user
            : client.user;
          if (!target) return;

          modBaseEvent({
            executor: m.executorid
              ? await client.users.fetch(m.executorid).catch(() => undefined)
              : undefined,
            target,
            reason: m.reason ?? language.none,
            msg:
              m.msgid && m.channelid
                ? await (await client.ch.getChannel.guildTextChannel(m.channelid))?.messages
                    .fetch(m.msgid)
                    .catch(() => undefined)
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

    const disboardBumpReminders = await client.ch
      .query(`SELECT * FROM disboard WHERE guildid = $1;`, [String(guild.id)])
      .then((r: DBT.disboard[] | null) => (r ? r[0] : null));
    if (disboardBumpReminders) disboard(disboardBumpReminders);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const giveawayEnd = (_: unknown) => null; // TODO: import giveaway handler

    const giveaways = await client.ch
      .query(`SELECT * FROM giveaways WHERE guildid = $1;`, [String(guild.id)])
      .then((r: DBT.giveaways[] | null) => r || null);
    giveaways?.forEach((g) => giveawayEnd(g));
  });
};
