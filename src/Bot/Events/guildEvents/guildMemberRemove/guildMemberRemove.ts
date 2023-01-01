import client from 'Bot/BaseClient/DDenoClient.js';
import type * as DDeno from 'discordeno';

export default async (user: DDeno.User, guildId: bigint) => {
  const member = await client.cache.members.get(user.id, guildId);

  const files: {
    default: (u: DDeno.User, m: DDeno.Member | undefined, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guild = await client.cache.guilds.get(guildId);
  if (!guild) return;

  files.forEach((f) => f.default(user, member, guild));
};
