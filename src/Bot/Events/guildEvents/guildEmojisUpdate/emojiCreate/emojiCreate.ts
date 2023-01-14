import * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emote: DDeno.DiscordEmoji, guild: DDeno.Guild) => {
  const files: {
    default: (e: DDeno.DiscordEmoji, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.emojis.set(DDeno.transformEmoji(client, emote), guild.id);

  files.forEach((f) => f.default(emote, guild));
};
