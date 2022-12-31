import client from 'Bot/BaseClient/DDenoClient.js';
import type * as DDeno from 'discordeno';

export default async (user: DDeno.User, guildId: bigint) => {
  const files: {
    default: (t: DDeno.User, guild: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guild = await client.cache.guilds.get(guildId);
  if (!guild) return;

  files.forEach((f) => f.default(user, guild));
};
