import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { guildId: bigint; roleId: bigint }) => {
  const role = client.ch.cache.roles.cache.get(payload.guildId)?.get(payload.roleId);
  client.ch.cache.roles.delete(payload.roleId);

  const files: {
    default: (t: { guildId: bigint; roleId: bigint }, r?: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, role));
};
