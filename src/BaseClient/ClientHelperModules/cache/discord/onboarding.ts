import * as Discord from 'discord.js';
import error from '../../error.js';

export interface Onboarding {
 get: (guild: Discord.Guild) => Promise<Discord.GuildOnboarding | undefined>;
 set: (guildId: string, onboarding: Discord.GuildOnboarding) => void;
 delete: (guildId: string) => void;
 cache: Map<string, Discord.GuildOnboarding>;
}

const self: Onboarding = {
 get: async (guild) => {
  const cached = self.cache.get(guild.id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getOnboarding(guild);
  if ('message' in fetched) {
   error(guild, new Error('Couldnt get Onboarding'));
   return undefined;
  }

  self.set(guild.id, fetched);
  return fetched;
 },

 set: (id, onboarding) => {
  self.cache.set(id, onboarding);
 },
 delete: (id) => {
  self.cache.delete(id);
 },
 cache: new Map(),
};

export default self;
