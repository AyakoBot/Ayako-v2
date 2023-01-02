import type * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-cycle
import client from '../../../BaseClient/DDenoClient.js';

export default async (guild: DDeno.Guild) => {
  client.helpers.getMembers(guild.id, {});

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
};
