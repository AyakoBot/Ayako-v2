import type * as DDeno from 'discordeno';

export default async (
  afterEmote: DDeno.DiscordEmoji,
  beforeEmote: DDeno.Emoji | undefined,
  guild: DDeno.Guild,
) => {
  const files: {
    default: (a: DDeno.DiscordEmoji, b: DDeno.Emoji | undefined, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(afterEmote, beforeEmote, guild));
};
