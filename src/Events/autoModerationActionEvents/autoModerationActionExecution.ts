import type * as Discord from 'discord.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
  const files: { default: (t: Discord.AutoModerationActionExecution) => void }[] =
    await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msg));
};
