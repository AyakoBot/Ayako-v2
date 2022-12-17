import type * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-cycle
import client from '../../../BaseClient/DDenoClient.js';

export default async (guild: DDeno.Guild) => {
  client.helpers.getMembers(guild.id, {});

  const autorules = await client.helpers.getAutomodRules(guild.id);
  autorules.forEach((r) => client.automodRules.set(r.id, r));
};
