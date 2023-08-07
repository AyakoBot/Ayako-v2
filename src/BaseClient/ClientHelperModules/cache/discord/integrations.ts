import type * as Discord from 'discord.js';

export interface Integrations {
 get: (integrationId: string, guildId: string) => Promise<Discord.Integration | undefined>;
 set: (integration: Discord.Integration, guildId: string) => void;
 find: (integrationId: string) => Discord.Integration | undefined;
 delete: (integrationId: string, guildId: string) => void;
 cache: Map<string, Map<string, Discord.Integration>>;
}

const self: Integrations = {
 get: async (id, guildId) => {
  const cached = self.cache.get(guildId)?.get(id);
  if (cached) return cached;

  const client = (await import('../../../Client.js')).default;
  const fetched = await client.guilds.cache.get(guildId)?.fetchIntegrations();
  fetched?.forEach((f) => self.set(f, guildId));

  return fetched?.find((f) => f.id === id);
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
