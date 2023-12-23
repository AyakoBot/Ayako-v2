import * as Jobs from 'node-schedule';

/**
 * Interface for managing sticky timeouts for a bot.
 */
export interface StickyTimeouts {
 /**
  * Sets a sticky timeout for a given channel ID and job.
  * @param channelId - The ID of the channel to set the sticky timeout for.
  * @param messageId - The ID of the message to set the sticky timeout for.
  * @param job - The job to set the sticky timeout for.
  */
 set: (channelId: string, messageId: string, job: Jobs.Job) => void;
 /**
  * Deletes the sticky timeout for a given channel ID.
  * @param channelId - The ID of the channel to delete the sticky timeout for.
  */
 delete: (channelId: string) => void;
 /**
  * Finds the sticky timeout for a given message ID.
  * @param messageId - The ID of the message to find the sticky timeout for.
  */
 find: (messageId: string) => { job: Jobs.Job; messageId: string } | undefined;
 /**
  * Map of channel IDs to their corresponding jobs with sticky timeouts.
  */
 cache: Map<string, { job: Jobs.Job; messageId: string }>;
}

const self: StickyTimeouts = {
 set: (channelId, messageId, job) => {
  const cached = self.cache.get(channelId);
  cached?.job.cancel();

  self.cache.set(channelId, { messageId, job });
 },
 delete: (channelId) => {
  const cached = self.cache.get(channelId);

  cached?.job.cancel();
  self.cache.delete(channelId);
 },
 find: (messageId) => [...self.cache.values()].find((v) => v.messageId === messageId),
 cache: new Map(),
};

export default self;
