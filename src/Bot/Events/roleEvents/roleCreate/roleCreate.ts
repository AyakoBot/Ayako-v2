import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (role: DDeno.Role) => {
  const files: {
    default: (t: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.roles.set(role);

  files.forEach((f) => f.default(role));
};
