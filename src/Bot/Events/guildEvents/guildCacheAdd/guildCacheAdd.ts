import type * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-cycle
import client from '../../../BaseClient/DDenoClient.js';

export default async (guild: DDeno.Guild) => {
  client.guilds.set(guild.id, guild);

  const autorules = await client.helpers.getAutomodRules(guild.id);
  autorules.forEach((r) => {
    if (!client.automodRules.get(r.guildId)) client.automodRules.set(r.guildId, new Map());
    client.automodRules.get(r.guildId)?.set(r.id, r);
  });

  const emojis = await client.helpers.getEmojis(guild.id);
  emojis.forEach((e) => {
    if (!e.id) return;

    if (!client.emojis.get(guild.id)) client.emojis.set(guild.id, new Map());
    client.emojis.get(guild.id)?.set(e.id, e);
  });

  const roles = await client.helpers.getRoles(guild.id);
  roles.forEach((r) => {
    if (!client.roles.get(guild.id)) client.roles.set(guild.id, new Map());
    client.roles.get(guild.id)?.set(r.id, r);
  });

  const channels = await client.helpers.getChannels(guild.id);
  channels.forEach((c) => {
    if (!client.channels.get(guild.id)) client.channels.set(guild.id, new Map());
    client.channels.get(guild.id)?.set(c.id, c);
  });

  const members = await getMembers(guild);
  members.forEach((m) => {
    if (!client.members.get(guild.id)) client.members.set(guild.id, new Map());
    client.members.get(guild.id)?.set(m.id, m);
  });
};

const getMembers = async (guild: DDeno.Guild) => {
  const get = (lastId?: bigint) =>
    client.helpers.getMembers(guild.id, { limit: 1000, after: lastId?.toString() });

  const members: DDeno.Member[] = [];

  for (let i = 0; i < (guild.approximateMemberCount ?? guild.memberCount) + 1000 / 1000; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    members.push(...(await get(members[members.length - 1].id)).array());
  }

  return members;
};
