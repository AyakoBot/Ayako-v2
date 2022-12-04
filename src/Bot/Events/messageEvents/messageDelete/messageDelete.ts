import type DDeno from 'discordeno';

export default async (msg: DDeno.Message) => {
  if (!msg) return;
  if (!('guildId' in msg) || !msg.guildId) return;

  const files: { default: (t: DDeno.Message) => void }[] = await Promise.all(
    ['./giveaway.js', './log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg));
};
