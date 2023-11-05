import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';

/**
 * Interface for managing Welcome Screens cache.
 */
export interface WelcomeScreens {
 /**
  * Retrieves the Welcome Screen for the specified guild.
  * @param guild The guild to retrieve the Welcome Screen for.
  * @returns A Promise that resolves with the Welcome Screen, or undefined if not found.
  */
 get: (guild: Discord.Guild) => Promise<Discord.WelcomeScreen | undefined>;

 /**
  * Sets the Welcome Screen for the specified guild.
  * @param welcomeScreen The Welcome Screen to set.
  */
 set: (welcomeScreen: Discord.WelcomeScreen) => void;

 /**
  * Deletes the Welcome Screen for the specified guild.
  * @param guildId The ID of the guild to delete the Welcome Screen for.
  */
 delete: (guildId: string) => void;

 /**
  * The cache of Welcome Screens,
  * stored as a Map with guild IDs as keys and Welcome Screens as values.
  */
 cache: Map<string, Discord.WelcomeScreen>;
}

const self: WelcomeScreens = {
 get: async (guild) => {
  const cached = self.cache.get(guild.id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getWelcomeScreen(guild);
  if (!fetched) return undefined;
  if ('message' in fetched) {
   error(guild, new Error(`Couldnt get Welcome Screen`));
   return undefined;
  }

  self.set(fetched);
  return fetched;
 },
 set: (screen: Discord.WelcomeScreen) => {
  self.cache.set(screen.guild.id, screen);
 },
 delete: (guildId) => {
  self.cache.delete(guildId);
 },
 cache: new Map(),
};

export default self;
