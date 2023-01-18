import type * as Discord from 'discord.js';

export default async (msg: DDeno.AutoModerationActionExecution) => {
  if (!msg) return;
  if (!('guildId' in msg) || !msg.guildId) return;

  const files: { default: (t: DDeno.AutoModerationActionExecution) => void }[] = await Promise.all(
    ['./log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg));
};
