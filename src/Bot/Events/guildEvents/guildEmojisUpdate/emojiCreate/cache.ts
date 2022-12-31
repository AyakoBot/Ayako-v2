import type * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emoji: DDeno.DiscordEmoji, guild: DDeno.Guild) => {
  if (!emoji.id) return;

  const emote = await client.helpers.getEmoji(guild.id, BigInt(emoji.id));
  client.emojis.set(BigInt(emoji.id), emote);
};
