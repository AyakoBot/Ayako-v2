import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

export interface Integrations {
 get: (integrationId: string, guild: Discord.Guild) => Promise<Discord.Integration | undefined>;
 set: (integration: Discord.Integration, guildId: string) => void;
 find: (integrationId: string) => Discord.Integration | undefined;
 delete: (integrationId: string, guildId: string) => void;
 cache: Map<string, Map<string, Discord.Integration>>;
}

const self: Integrations = {
 get: async (id, guild) => {
  const cached = self.cache.get(guild.id)?.get(id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getIntegrations(guild);
  if ('message' in fetched) {
   error(guild, new Error('Couldnt get Guild Integrations'));
   return undefined;
  }

  fetched?.forEach((f) => self.set(new Classes.Integration(guild.client, f, guild), guild.id));

  return self.cache.get(guild.id)?.get(id);
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
