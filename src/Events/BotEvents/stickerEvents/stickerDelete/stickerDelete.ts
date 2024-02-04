import type * as Discord from 'discord.js';

export default async (sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 sticker.client.util.importCache.Events.BotEvents.stickerEvents.stickerDelete.log.file.default(
  sticker,
 );
};
