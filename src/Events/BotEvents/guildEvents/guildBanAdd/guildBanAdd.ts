import type * as Discord from 'discord.js';

export default async (ban: Discord.GuildBan) => {
 ban.client.util.importCache.Events.BotEvents.guildEvents.guildBanAdd.log.file.default(ban);
};
