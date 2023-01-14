import * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (afterEmote: DDeno.DiscordEmoji, guild: DDeno.Guild) => {
  if (!afterEmote.id) return;

  const files: {
    default: (a: DDeno.DiscordEmoji, b: DDeno.Emoji | undefined, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  const cached = client.ch.cache.emojis.cache.get(guild.id)?.get(BigInt(afterEmote.id));
  client.ch.cache.emojis.set(DDeno.transformEmoji(client, afterEmote), guild.id);

  files.forEach((f) => f.default(afterEmote, cached, guild));
};
