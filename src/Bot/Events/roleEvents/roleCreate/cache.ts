import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (role: DDeno.Role) => {
  if (!client.roles.get(role.guildId)) client.roles.set(role.guildId, new Map());
  client.roles.get(role.guildId)?.set(role.id, role);
};
