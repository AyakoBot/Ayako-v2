import type * as Discord from 'discord.js';

export interface WelcomeScreens {
 get: (guildId: string) => Promise<Discord.WelcomeScreen | undefined>;
 set: (welcomeScreen: Discord.WelcomeScreen) => void;
 delete: (guildId: string) => void;
 cache: Map<string, Discord.WelcomeScreen>;
}

const self: WelcomeScreens = {
 get: async (guildId) => {
  const cached = self.cache.get(guildId);
  if (cached) return cached;

  const client = (await import('../../../Client.js')).default;
  const fetched = await client.guilds.cache.get(guildId)?.fetchWelcomeScreen();
  if (!fetched) return undefined;

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
