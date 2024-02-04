import type * as Discord from 'discord.js';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
 emote.client.util.importCache.Events.BotEvents.emojiEvents.emojiUpdate.log.file.default(
  oldEmote,
  emote,
 );
};
