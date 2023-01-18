import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (role: DDeno.Role) => {
  const cached = client.ch.cache.roles.cache.get(role.guild.id)?.get(role.id);
  client.ch.cache.roles.set(role);
  if (!cached) return;

  const files: {
    default: (r2: DDeno.Role, r: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cached, role));
};
