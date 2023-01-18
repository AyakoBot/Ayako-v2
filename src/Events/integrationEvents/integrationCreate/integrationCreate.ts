import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (integration: DDeno.Integration) => {
  const files: {
    default: (i: DDeno.Integration) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.integrations.set(integration);

  files.forEach((f) => f.default(integration));
};
