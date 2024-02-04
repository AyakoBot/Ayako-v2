import type * as Discord from 'discord.js';

export default async (oldSticker: Discord.Sticker, sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 sticker.client.util.importCache.Events.BotEvents.stickerEvents.stickerUpdate.log.file.default(
  oldSticker,
  sticker,
 );
};
