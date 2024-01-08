import * as Jobs from 'node-schedule';

/**
 * Interface for Vote cache.
 */
export interface Votes {
 /**
  * Sets a job for the given vote entity and user ID.
  * @param job - The job to set.
  * @param votedId - The ID of the voted entity.
  * @param userId - The ID of the user that voted.
  */
 set: (job: Jobs.Job, votedId: string, userId: string) => void;

 /**
  * Deletes the job for the given vote entity and user ID.
  * @param votedId - The ID of the voted entity.
  * @param userId - The ID of the user that voted.
  */
 delete: (votedId: string, userId: string) => void;

 /**
  * Cache of jobs for each vote entity and user ID combination.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: Votes = {
 set: (job, votedId, userId) => {
  const cached = self.cache.get(votedId)?.get(userId);
  cached?.cancel();

  if (!self.cache.get(votedId)) self.cache.set(votedId, new Map());
  self.cache.get(votedId)?.set(userId, job);
 },
 delete: (votedId, userId) => {
  const cached = self.cache.get(votedId)?.get(userId);
  cached?.cancel();

  if (self.cache.get(votedId)?.size === 1) self.cache.delete(votedId);
  else self.cache.get(votedId)?.delete(userId);
 },
 cache: new Map(),
};

export default self;
