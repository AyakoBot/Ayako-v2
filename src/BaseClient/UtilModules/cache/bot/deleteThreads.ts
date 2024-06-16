import * as Jobs from 'node-schedule';
import DataBase from '../../../Bot/DataBase.js';

/**
 * Interface for managing thread deletion jobs in the cache.
 */
export interface DeleteThreads {
 /**
  * Adds a new thread deletion job to the cache.
  * @param job - The job to add to the cache.
  * @param guildId - The ID of the guild the job is associated with.
  * @param channelId - The ID of the channel the job is associated with.
  */
 set: (job: Jobs.Job, guildId: string, channelId: string) => void;

 /**
  * Removes a thread deletion job from the cache.
  * @param guildId - The ID of the guild the job is associated with.
  * @param channelId - The ID of the channel the job is associated with.
  */
 delete: (guildId: string, channelId: string) => void;

 /**
  * The cache of thread deletion jobs, organized by guild ID and channel ID.
  */
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: DeleteThreads = {
 set: (job, guildId, channelId) => {
  const cached = self.cache.get(guildId)?.get(channelId);
  cached?.cancel();

  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(channelId, job);

  DataBase.deletethreads
   .create({
    data: {
     guildid: guildId,
     channelid: channelId,
     deletetime: job.nextInvocation().getTime(),
    },
   })
   .then();
 },
 delete: (guildId, channelId) => {
  const cached = self.cache.get(guildId)?.get(channelId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(channelId);

  DataBase.deletethreads
   .delete({
    where: {
     guildid: guildId,
     channelid: channelId,
    },
   })
   .then();
 },
 cache: new Map(),
};

export default self;
