import type * as Discord from 'discord.js';

export default async (
  oldWebhook: Discord.Webhook,
  webhook: Discord.Webhook,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const files: {
    default: (
      w: Discord.Webhook,
      w2: Discord.Webhook,
      c: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldWebhook, webhook, channel));
};
