import * as Jobs from 'node-schedule';

/**
 * Interface for managing suggestions deletion.
 */
export interface DeleteSuggestions {
 /**
  * Sets a job to delete a suggestion message.
  * @param job - The job to set.
  * @param guildId - The ID of the guild where the suggestion message belongs.
  * @param msgId - The ID of the suggestion message to delete.
  */
 set: (job: Jobs.Job, guildId: string, msgId: string) => void;

 /**
  * Deletes a suggestion message from cache.
  * @param guildId - The ID of the guild where the suggestion message belongs.
  * @param msgId - The ID of the suggestion message to delete.
  */
 delete: (guildId: string, msgId: string) => void;

 /**
  * Map containing the cached suggestion messages.
  * The keys are guild IDs and the values are maps containing suggestion message IDs
  * and their corresponding jobs.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: DeleteSuggestions = {
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
