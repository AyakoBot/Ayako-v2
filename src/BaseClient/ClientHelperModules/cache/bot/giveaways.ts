import * as Jobs from 'node-schedule';

/**
 * Interface for managing giveaways in the cache.
 */
export interface Giveaways {
 /**
  * Sets a job for a giveaway in the cache.
  * @param job - The job to set.
  * @param guildId - The ID of the guild where the giveaway is taking place.
  * @param channelId - The ID of the channel where the giveaway message was sent.
  * @param msgId - The ID of the giveaway message.
  */
 set: (job: Jobs.Job, guildId: string, channelId: string, msgId: string) => void;

 /**
  * Deletes a job for a giveaway from the cache.
  * @param guildId - The ID of the guild where the giveaway is taking place.
  * @param channelId - The ID of the channel where the giveaway message was sent.
  * @param msgId - The ID of the giveaway message.
  */
 delete: (guildId: string, channelId: string, msgId: string) => void;

 /**
  * The cache of giveaways, organized by guild ID, channel ID, and message ID.
  */
 cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
}

const self: Giveaways = {
 set: (job, guildId, channelId, msgId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(msgId);
  cached?.cancel();

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(channelId)) {
   self.cache.get(guildId)?.set(channelId, new Map());
  }

  self.cache.get(guildId)?.get(channelId)?.set(msgId, job);
 },
 delete: (guildId, channelId, msgId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(msgId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else self.cache.get(guildId)?.get(channelId)?.delete(msgId);
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else self.cache.get(guildId)?.get(channelId)?.delete(msgId);
 },
 cache: new Map(),
};

export default self;
