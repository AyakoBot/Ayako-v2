import type * as DDeno from 'discordeno';
import * as Jobs from 'node-schedule';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (guild: DDeno.Guild) => {
  const language = await client.ch.languageSelector(guild.id);

  client.ch.cache.guilds.set(guild);
  client.ch.cache.members.get(guild.ownerId, guild.id);

  const webhooks = await client.helpers.getGuildWebhooks(guild.id);
  webhooks.forEach((w) => client.ch.cache.webhooks.set(w));

  const automodRules = await client.helpers.getAutomodRules(guild.id);
  automodRules.forEach((r) => client.ch.cache.automodRules.set(r));

  const emojis = await client.helpers.getEmojis(guild.id);
  emojis.forEach((e) => client.ch.cache.emojis.set(e, guild.id));

  const integrations = await client.helpers.getIntegrations(guild.id);
  integrations.forEach((i) => client.ch.cache.integrations.set(i));

  const roles = await client.helpers.getRoles(guild.id);
  roles.forEach((r) => client.ch.cache.roles.set(r));

  const stickers = await client.helpers.getGuildStickers(guild.id);
  stickers.forEach((s) => client.ch.cache.stickers.set(s));

  const scheduledEvents = await client.helpers.getScheduledEvents(guild.id);
  scheduledEvents.forEach(async (e) => {
    const users = await client.ch.getScheduledEventUsers(guild.id, e);
    (e as CT.ScheduledEvent).users = users;
    client.ch.cache.scheduledEvents.set(e);
  });

  const activeThreads = await client.helpers.getActiveThreads(guild.id);
  activeThreads.threads.forEach((t) => {
    const users = activeThreads.members.filter((m) => m.id === t.id);
    (t as CT.Thread).members = users.map((u) => u.userId).filter((u): u is bigint => !!u);
    client.ch.cache.threads.set(t);
  });

  guild.channels.forEach(async (c) => {
    client.ch.cache.channels.set(c);

    const invites = await client.helpers.getInvites(guild.id);
    invites.forEach((i) => client.ch.cache.invites.set(i));
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
    client.ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        modBaseEvent({
          executor: m.executorid
            ? await client.ch.cache.users.get(BigInt(m.executorid))
            : undefined,
          target: m.userid
            ? (await client.ch.cache.users.get(BigInt(m.userid))) ?? client.me
            : client.me,
          reason: m.reason ?? language.none,
          msg:
            m.msgid && m.channelid && m.guildid
              ? await client.ch.cache.messages.get(
                  BigInt(m.msgid),
                  BigInt(m.channelid),
                  BigInt(m.guildid),
                )
              : undefined,
          guild,
          type: 'muteRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      BigInt(m.userid),
    );
  });

  const bans = await client.ch
    .query(`SELECT * FROM punish_tempbans WHERE userid = $1 AND guildid = $2;`)
    .then((r: DBT.punish_tempbans[] | null) => r || null);
  bans?.forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);
    client.ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        modBaseEvent({
          executor: m.executorid
            ? await client.ch.cache.users.get(BigInt(m.executorid))
            : undefined,
          target: m.userid
            ? (await client.ch.cache.users.get(BigInt(m.userid))) ?? client.me
            : client.me,
          reason: m.reason ?? language.none,
          msg:
            m.msgid && m.channelid && m.guildid
              ? await client.ch.cache.messages.get(
                  BigInt(m.msgid),
                  BigInt(m.channelid),
                  BigInt(m.guildid),
                )
              : undefined,
          guild,
          type: 'banRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      BigInt(m.userid),
    );
  });

  const channelBans = await client.ch
    .query(`SELECT * FROM punish_tempchannelbans WHERE userid = $1 AND guildid = $2;`)
    .then((r: DBT.punish_tempchannelbans[] | null) => r || null);
  channelBans?.forEach((m) => {
    const time = Number(m.uniquetimestamp) + Number(m.duration);
    client.ch.cache.mutes.set(
      Jobs.scheduleJob(Date.now() < time ? 1000 : time, async () => {
        modBaseEvent({
          executor: m.executorid
            ? await client.ch.cache.users.get(BigInt(m.executorid))
            : undefined,
          target: m.userid
            ? (await client.ch.cache.users.get(BigInt(m.userid))) ?? client.me
            : client.me,
          reason: m.reason ?? language.none,
          msg:
            m.msgid && m.channelid && m.guildid
              ? await client.ch.cache.messages.get(
                  BigInt(m.msgid),
                  BigInt(m.channelid),
                  BigInt(m.guildid),
                )
              : undefined,
          guild,
          type: 'channelbanRemove',
          duration: Number(m.duration),
        });
      }),
      guild.id,
      BigInt(m.userid),
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
};
