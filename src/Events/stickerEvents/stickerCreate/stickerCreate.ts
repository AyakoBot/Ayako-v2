import type * as Discord from 'discord.js';
import log from './log.js';

export default async (sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 log(sticker);
};
