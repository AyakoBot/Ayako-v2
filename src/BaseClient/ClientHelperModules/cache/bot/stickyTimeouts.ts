import * as Jobs from 'node-schedule';

/**
 * Interface for managing sticky timeouts for a bot.
 */
export interface StickyTimeouts {
 /**
  * Sets a sticky timeout for a given channel ID and job.
  * @param channelId - The ID of the channel to set the sticky timeout for.
  * @param job - The job to set the sticky timeout for.
  */
 set: (channelId: string, job: Jobs.Job) => void;
 /**
  * Deletes the sticky timeout for a given channel ID.
  * @param channelId - The ID of the channel to delete the sticky timeout for.
  */
 delete: (channelId: string) => void;
 /**
  * Map of channel IDs to their corresponding jobs with sticky timeouts.
  */
 cache: Map<string, Jobs.Job>;
}

const self: StickyTimeouts = {
 set: (channelId, job) => {
  const cached = self.cache.get(channelId);
  cached?.cancel();

  self.cache.set(channelId, job);
 },
 delete: (channelId) => {
  const cached = self.cache.get(channelId);
  cached?.cancel();
  self.cache.delete(channelId);
 },
 cache: new Map(),
};

export default self;
