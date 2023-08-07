import * as Discord from 'discord.js';

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

  const onboarding = await guild.fetchOnboarding();
  self.set(guild.id, onboarding);

  return onboarding;
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
