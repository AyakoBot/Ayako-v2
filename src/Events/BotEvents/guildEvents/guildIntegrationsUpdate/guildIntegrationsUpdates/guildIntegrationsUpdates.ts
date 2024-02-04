import type * as Discord from 'discord.js';

export default async (
 oldIntegration: Discord.Integration | undefined,
 integration: Discord.Integration,
) => {
 if (!oldIntegration) return;
 integration.client.util.importCache.Events.BotEvents.guildEvents.guildIntegrationsUpdate.guildIntegrationsUpdates.log.file.default(
  oldIntegration,
  integration,
 );
};
