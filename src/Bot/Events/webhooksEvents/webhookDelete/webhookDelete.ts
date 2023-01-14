import type * as DDeno from 'discordeno';

export default async (webhook: DDeno.Webhook) => {
  const files: {
    default: (w: DDeno.Webhook) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(webhook));
};
