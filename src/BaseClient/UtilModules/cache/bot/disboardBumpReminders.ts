import * as Jobs from 'node-schedule';

/**
 * Interface for Disboard bump reminders cache.
 */
export interface DisboardBumpReminders {
 /**
  * Sets a job for a guild in the cache.
  * @param job - The job to set.
  * @param guildId - The ID of the guild to set the job for.
  */
 set: (job: Jobs.Job, guildId: string) => void;

 /**
  * Deletes a job for a guild from the cache.
  * @param guildId - The ID of the guild to delete the job for.
  */
 delete: (guildId: string) => void;

 /**
  * The cache of Disboard bump reminders jobs, keyed by guild ID.
  */
 cache: Map<string, Jobs.Job>;
}

const self: DisboardBumpReminders = {
 set: (job, guildId) => {
  const cached = self.cache.get(guildId);
  cached?.cancel();

  self.cache.set(guildId, job);
 },
 delete: (guildId) => {
  const cached = self.cache.get(guildId);
  cached?.cancel();
  self.cache.delete(guildId);
 },
 cache: new Map(),
};

export default self;
