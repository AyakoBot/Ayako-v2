import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { guildId: bigint; roleId: bigint }) => {
  const role = client.roles.get(payload.guildId)?.get(payload.roleId);

  const files: {
    default: (t: { guildId: bigint; roleId: bigint }, r?: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, role));
};
