import type * as Discord from 'discord.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
  if (!msg) return;
  if (!('guildId' in msg) || !msg.guild.id) return;

  const files: { default: (t: Discord.AutoModerationActionExecution) => void }[] =
    await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msg));
};
