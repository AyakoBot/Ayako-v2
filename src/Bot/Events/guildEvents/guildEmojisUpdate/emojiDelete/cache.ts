import type * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emoji: DDeno.Emoji) => {
  if (!emoji.id) return;

  client.emojis.delete(BigInt(emoji.id));
};
