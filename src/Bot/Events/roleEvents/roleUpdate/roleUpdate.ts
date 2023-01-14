import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default (role: DDeno.Role) => {
  const cached = client.ch.cache.roles.cache.get(role.guildId)?.get(role.id);

  // TODO
};
