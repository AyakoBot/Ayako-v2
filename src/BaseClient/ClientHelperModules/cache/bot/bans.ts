import * as Jobs from 'node-schedule';

/**
 * Interface for managing bans cache.
 */
export interface Bans {
 /**
  * Sets a job for a user in a guild.
  * @param job - The job to set.
  * @param guildId - The ID of the guild.
  * @param userId - The ID of the user.
  */
 set: (job: Jobs.Job, guildId: string, userId: string) => void;
 /**
  * Deletes a job for a user in a guild.
  * @param guildId - The ID of the guild.
  * @param userId - The ID of the user.
  */
 delete: (guildId: string, userId: string) => void;
 /**
  * The cache of bans.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: Bans = {
 set: (job, guildId, userId) => {
  const cached = self.cache.get(guildId)?.get(userId);
  cached?.cancel();

  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(userId, job);
 },
 delete: (guildId, userId) => {
  const cached = self.cache.get(guildId)?.get(userId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(userId);
 },
 cache: new Map(),
};

export default self;
