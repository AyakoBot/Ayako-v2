import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (integration: DDeno.Integration) => {
  const files: {
    default: (i: DDeno.Integration) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.integrations.set(integration);

  files.forEach((f) => f.default(integration));
};
