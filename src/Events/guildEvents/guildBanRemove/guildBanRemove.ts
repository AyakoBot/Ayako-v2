import client from 'BaseClient/Client.js';
import type * as Discord from 'discord.js';

export default async (user: DDeno.User, guildId: bigint) => {
  const files: {
    default: (t: DDeno.User, guild: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guild = await client.ch.cache.guilds.get(guildId);
  if (!guild) return;

  files.forEach((f) => f.default(user, guild));
};
