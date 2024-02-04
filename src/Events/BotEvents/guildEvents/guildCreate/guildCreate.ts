import type * as Discord from 'discord.js';

export default async (guild: Discord.Guild) => {
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildCreate.log.file.default(guild);
 guild.client.util.importCache.Events.BotEvents.guildEvents.guildCreate.cache.file.default(guild);
 guild.client.util.importCache.Commands.ButtonCommands.rp.toggle.file.create(guild);
};
