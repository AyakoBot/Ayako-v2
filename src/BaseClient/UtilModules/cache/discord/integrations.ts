import * as Discord from 'discord.js';

/**
 * Represents a collection of integrations for a guild.
 */
export interface Integrations {
 /**
  * Retrieves an integration by its ID for the specified guild.
  * @param integrationId The ID of the integration to retrieve.
  * @param guild The guild to retrieve the integration from.
  * @returns A promise that resolves with the retrieved integration, or undefined if not found.
  */
 get: (integrationId: string, guild: Discord.Guild) => Promise<Discord.Integration | undefined>;

 /**
  * Adds or updates an integration for the specified guild.
  * @param integration The integration to add or update.
  * @param guildId The ID of the guild to add or update the integration for.
  */
 set: (integration: Discord.Integration, guildId: string) => void;

 /**
  * Finds an integration by its ID.
  * @param integrationId The ID of the integration to find.
  * @returns The found integration, or undefined if not found.
  */
 find: (integrationId: string) => Discord.Integration | undefined;

 /**
  * Deletes an integration by its ID for the specified guild.
  * @param integrationId The ID of the integration to delete.
  * @param guildId The ID of the guild to delete the integration from.
  */
 delete: (integrationId: string, guildId: string) => void;

 /**
  * The cache of integrations, keyed by guild ID and then integration ID.
  */
 cache: Map<string, Map<string, Discord.Integration>>;
}

const self: Integrations = {
 get: async (id, guild) => {
  const cached = self.cache.get(guild.id)?.get(id);
  if (cached) return cached;

  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getIntegrations(guild);
  if ('message' in fetched) return undefined;

  fetched?.forEach((f) => self.set(f, guild.id));

  return fetched.find((f) => f.id === id);
 },
 set: (integration, guildId) => {
  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }
  self.cache.get(guildId)?.set(integration.id, integration);
 },
 find: (id) =>
  Array.from(self.cache, ([, g]) => g)
   .map((c) => Array.from(c, ([, i]) => i))
   .flat()
   .find((r) => r.id === id),
 delete: (id, guildId) => {
  const cached = self.find(id);
  if (!cached) return;

  if (self.cache.get(guildId)?.size === 1) {
   self.cache.delete(guildId);
  } else {
   self.cache.get(guildId)?.delete(id);
  }
 },
 cache: new Map(),
};

export default self;
