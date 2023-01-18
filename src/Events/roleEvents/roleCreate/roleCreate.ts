import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (role: DDeno.Role) => {
  const files: {
    default: (t: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.roles.set(role);

  files.forEach((f) => f.default(role));
};
