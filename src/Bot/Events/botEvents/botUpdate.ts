import type * as DDeno from 'discordeno';
import client from '../../BaseClient/DDenoClient.js';

export default async (user: DDeno.User, oldUser: DDeno.User) => {
  if (!oldUser) return;

  const files: {
    default: (t: DDeno.User, r: DDeno.User, g: DDeno.Guild[]) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guilds = client.cache.guilds.memory
    .filter(
      (g) =>
        !!(g as unknown as { members: Map<bigint, DDeno.Member> }).members.get(user.id) || false,
    )
    .map((o) => o);

  if (!guilds.length) return;

  files.forEach((f) => f.default(user, oldUser, guilds));
};
