import * as Discord from 'discord.js';
import error from '../../error.js';

export interface WelcomeScreens {
 get: (guild: Discord.Guild) => Promise<Discord.WelcomeScreen | undefined>;
 set: (welcomeScreen: Discord.WelcomeScreen) => void;
 delete: (guildId: string) => void;
 cache: Map<string, Discord.WelcomeScreen>;
}

const self: WelcomeScreens = {
 get: async (guild) => {
  const cached = self.cache.get(guild.id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getWelcomeScreen(guild);
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
