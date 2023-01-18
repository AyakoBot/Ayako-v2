import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (emote: DDeno.Emoji, guild: DDeno.Guild) => {
  if (!emote.id) return;

  const files: {
    default: (e: DDeno.Emoji, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const cached = client.ch.cache.emojis.cache.get(guild.id)?.get(emote.id);
  if (cached) emote = cached;

  files.forEach((f) => f.default(emote, guild));
};
