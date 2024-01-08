import * as Jobs from 'node-schedule';

/**
 * Interface for managing channel bans cache.
 */
export interface ChannelBans {
 /**
  * Adds a new channel ban to the cache.
  * @param job - The job to be added to the cache.
  * @param guildId - The ID of the guild where the ban occurred.
  * @param channelId - The ID of the channel where the ban occurred.
  * @param userId - The ID of the user who was banned.
  */
 set: (job: Jobs.Job, guildId: string, channelId: string, userId: string) => void;

 /**
  * Removes a channel ban from the cache.
  * @param guildId - The ID of the guild where the ban occurred.
  * @param channelId - The ID of the channel where the ban occurred.
  * @param userId - The ID of the user who was banned.
  */
 delete: (guildId: string, channelId: string, userId: string) => void;

 /**
  * The cache of channel bans, organized by guild ID, channel ID, and user ID.
  */
 cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
}

const self: ChannelBans = {
 set: (job, guildId, channelId, userId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(userId);
  cached?.cancel();

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(channelId)) {
   self.cache.get(guildId)?.set(channelId, new Map());
  }

  self.cache.get(guildId)?.get(channelId)?.set(userId, job);
 },
 delete: (guildId, channelId, userId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(userId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else self.cache.get(guildId)?.get(channelId)?.delete(userId);
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else self.cache.get(guildId)?.get(channelId)?.delete(userId);
 },
 cache: new Map(),
};

export default self;
