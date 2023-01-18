import type * as Discord from 'discord.js';

export default async (oldWebhook: DDeno.Webhook | undefined, webhook: DDeno.Webhook) => {
  const files: {
    default: (w: DDeno.Webhook | undefined, w2: DDeno.Webhook) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldWebhook, webhook));
};
