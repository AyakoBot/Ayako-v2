import * as Jobs from 'node-schedule';

/**
 * Interface for managing giveaway claim timeouts.
 */
export interface GiveawayClaimTimeout {
 /**
  * Sets a job for the given guild and message IDs.
  * @param job - The job to set.
  * @param guildId - The ID of the guild.
  * @param msgId - The ID of the message.
  */
 set: (job: Jobs.Job, guildId: string, msgId: string) => void;

 /**
  * Deletes the job for the given guild and message IDs.
  * @param guildId - The ID of the guild.
  * @param msgId - The ID of the message.
  */
 delete: (guildId: string, msgId: string) => void;

 /**
  * Cache of jobs for each guild and message ID combination.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: GiveawayClaimTimeout = {
 set: (job, guildId, msgId) => {
  const cached = self.cache.get(guildId)?.get(msgId);
  cached?.cancel();

  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(msgId, job);
 },
 delete: (guildId, msgId) => {
  const cached = self.cache.get(guildId)?.get(msgId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(msgId);
 },
 cache: new Map(),
};

export default self;
