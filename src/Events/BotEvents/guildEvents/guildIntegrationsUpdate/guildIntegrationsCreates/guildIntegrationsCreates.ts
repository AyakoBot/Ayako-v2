import type * as Discord from 'discord.js';

export default async (integration: Discord.Integration) => {
 integration.client.util.importCache.Events.BotEvents.guildEvents.guildIntegrationsUpdate.guildIntegrationsCreates.log.file.default(
  integration,
 );
};
