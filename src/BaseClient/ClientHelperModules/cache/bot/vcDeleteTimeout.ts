import * as Jobs from 'node-schedule';

/**
 * Interface for managing voice channel deletion.
 */
export interface VcDeleteTimeout {
 /**
  * Sets a job to delete a voice channel.
  * @param job - The job to set.
  * @param guildId - The ID of the guild where the voice channel belongs.
  * @param cId - The ID of the voice channel to delete.
  */
 set: (job: Jobs.Job, guildId: string, cId: string) => void;

 /**
  * Deletes a voice channel from cache.
  * @param guildId - The ID of the guild where the voice channel belongs.
  * @param cId - The ID of the voice channel to delete.
  */
 delete: (guildId: string, cId: string) => void;

 /**
  * Map containing the cached voice channels.
  * The keys are guild IDs and the values are maps containing voice channel IDs
  * and their corresponding jobs.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: VcDeleteTimeout = {
 set: (job, guildId, cId) => {
  const cached = self.cache.get(guildId)?.get(cId);
  cached?.cancel();

  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(cId, job);
 },
 delete: (guildId, cId) => {
  const cached = self.cache.get(guildId)?.get(cId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(cId);
 },
 cache: new Map(),
};

export default self;
