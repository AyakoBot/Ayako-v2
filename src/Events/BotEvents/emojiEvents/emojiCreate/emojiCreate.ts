import type * as Discord from 'discord.js';

export default async (emote: Discord.GuildEmoji) => {
 emote.client.util.importCache.Events.BotEvents.emojiEvents.emojiCreate.log.file.default(emote);
};
