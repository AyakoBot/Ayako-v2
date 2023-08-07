import type * as Discord from 'discord.js';

export interface ScheduledEventUsers {
 add: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
 remove: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
 cache: Map<string, Map<string, Map<string, Discord.User>>>;
}

const self: ScheduledEventUsers = {
 add: (user: Discord.User, guildId: string, eventId: string) => {
  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(eventId)) {
   self.cache.get(guildId)?.set(eventId, new Map());
  }

  self.cache.get(guildId)?.get(eventId)?.set(user.id, user);
 },
 remove: (user: Discord.User, guildId: string, eventId: string) => {
  const cached = self.cache.get(guildId);
  if (!cached) return;

  if (self.cache.size < 2) {
   if (self.cache.get(guildId)?.size === 1) {
    if (self.cache.get(guildId)?.get(eventId)?.size === 1) self.cache.clear();
    else self.cache.get(guildId)?.get(eventId)?.delete(user.id);
   } else self.cache.get(guildId)?.get(eventId)?.delete(user.id);
  } else self.cache.get(guildId)?.get(eventId)?.delete(user.id);
 },
 cache: new Map(),
};

export default self;
