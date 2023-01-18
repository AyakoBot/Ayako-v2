import client from 'BaseClient/Client.js';
import type * as Discord from 'discord.js';

export default async (user: DDeno.User, guildId: bigint) => {
  const files: {
    default: (u: DDeno.User, m: DDeno.Member | undefined, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guild = await client.ch.cache.guilds.get(guildId);
  if (!guild) return;

  const cached = client.ch.cache.members.cache.get(guild.id)?.get(user.id);
  client.ch.cache.members.delete(user.id, guild.id);

  files.forEach((f) => f.default(user, cached, guild));
};
