import type * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emoji: DDeno.Emoji, _: never, guild: DDeno.Guild) => {
  if (!emoji.id) return;

  const emote = await client.helpers.getEmoji(guild.id, BigInt(emoji.id));
  if (!client.emojis.get(guild.id)) client.emojis.set(guild.id, new Map());
  client.emojis.get(guild.id)?.set(BigInt(emoji.id), emote);
};
