import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldSticker: Discord.Sticker, sticker: Discord.Sticker) => {
  log(oldSticker, sticker);
};
