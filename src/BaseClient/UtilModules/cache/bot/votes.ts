import * as Jobs from 'node-schedule';

/**
 * Interface for Vote cache.
 */
export interface Votes {
 /**
  * Sets a job for the given vote entity and user ID.
  * @param job - The job to set.
  * @param guildId - The ID of the guild the vote was made in.
  * @param votedId - The ID of the voted entity.
  * @param userId - The ID of the user that voted.
  */
 set: (job: Jobs.Job, guildId: string, votedId: string, userId: string) => void;

 /**
  * Deletes the job for the given vote entity and user ID.
  * @param guildId - The ID of the guild the vote was made in.
  * @param votedId - The ID of the voted entity.
  * @param userId - The ID of the user that voted.
  */
 delete: (guildId: string, votedId: string, userId: string) => void;

 /**
  * Cache of jobs for each vote reminder entity, sorted by guild ID, then voted ID then user ID.
  */
 cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
}

const self: Votes = {
 set: (job, guildId, votedId, userId) => {
  const cached = self.cache.get(guildId)?.get(votedId)?.get(userId);
  cached?.cancel();

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(votedId)) {
   self.cache.get(guildId)?.set(votedId, new Map());
  }

  self.cache.get(guildId)?.get(votedId)?.set(userId, job);
 },
 delete: (guildId, votedId, userId) => {
  const cached = self.cache.get(guildId)?.get(votedId)?.get(userId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(votedId)?.size === 1) {
    self.cache.get(guildId)?.get(votedId)?.clear();
   } else self.cache.get(guildId)?.get(votedId)?.delete(userId);
  } else if (self.cache.get(guildId)?.get(votedId)?.size === 1) {
   self.cache.get(guildId)?.delete(votedId);
  } else self.cache.get(guildId)?.get(votedId)?.delete(userId);
 },
 cache: new Map(),
};

export default self;
