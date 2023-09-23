import * as Jobs from 'node-schedule';

/**
 * Interface for managing reminders.
 */
export interface Reminders {
 /**
  * Sets a reminder for a user.
  * @param job - The job to be executed.
  * @param userId - The ID of the user to set the reminder for.
  * @param timestamp - The timestamp when the reminder should be executed.
  */
 set: (job: Jobs.Job, userId: string, timestamp: number) => void;

 /**
  * Deletes a reminder for a user.
  * @param userId - The ID of the user to delete the reminder for.
  * @param timestamp - The timestamp of the reminder to be deleted.
  */
 delete: (userId: string, timestamp: number) => void;

 /**
  * Map of user IDs to a map of timestamps to jobs.
  */
 cache: Map<string, Map<number, Jobs.Job>>;
}

const self: Reminders = {
 set: (job, userId, timestamp) => {
  const cached = self.cache.get(userId)?.get(timestamp);
  cached?.cancel();

  if (!self.cache.get(userId)) self.cache.set(userId, new Map());
  self.cache.get(userId)?.set(timestamp, job);
 },
 delete: (userId, timestamp) => {
  const cached = self.cache.get(userId)?.get(timestamp);
  cached?.cancel();

  if (self.cache.get(userId)?.size === 1) self.cache.delete(userId);
  else self.cache.get(userId)?.delete(timestamp);
 },
 cache: new Map(),
};

export default self;
