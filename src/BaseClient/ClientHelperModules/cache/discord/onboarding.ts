import * as Discord from 'discord.js';
import error from '../../error.js';

/**
 * Interface for managing onboarding data for a Discord guild.
 */
export interface Onboarding {
 /**
  * Retrieves the onboarding data for the specified guild.
  * @param guild The guild to retrieve onboarding data for.
  * @returns A Promise that resolves to the onboarding data for the guild,
  * or undefined if no data is found.
  */
 get: (guild: Discord.Guild) => Promise<Discord.GuildOnboarding | undefined>;

 /**
  * Sets the onboarding data for the specified guild.
  * @param guildId The ID of the guild to set onboarding data for.
  * @param onboarding The onboarding data to set for the guild.
  */
 set: (guildId: string, onboarding: Discord.GuildOnboarding) => void;

 /**
  * Deletes the onboarding data for the specified guild.
  * @param guildId The ID of the guild to delete onboarding data for.
  */
 delete: (guildId: string) => void;

 /**
  * A Map containing the cached onboarding data for each guild.
  */
 cache: Map<string, Discord.GuildOnboarding>;
}

const self: Onboarding = {
 get: async (guild) => {
  const cached = self.cache.get(guild.id);
  if (cached) return cached;

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
