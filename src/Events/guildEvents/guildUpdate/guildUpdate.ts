import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (guild: DDeno.Guild, oldGuild: DDeno.Guild) => {
  const files: {
    default: (g: DDeno.Guild, oG: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const cached = client.ch.cache.guilds.cache.get(guild.id);
  if (cached) oldGuild = cached;
  client.ch.cache.guilds.set(guild);

  files.forEach((f) => f.default(guild, oldGuild));
};
