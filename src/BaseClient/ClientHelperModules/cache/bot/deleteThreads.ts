import * as Jobs from 'node-schedule';

export interface DeleteThreads {
 set: (job: Jobs.Job, guildId: string, channelId: string) => void;
 delete: (guildId: string, channelIdF: string) => void;
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: DeleteThreads = {
 set: (job, guildId, channelId) => {
  const cached = self.cache.get(guildId)?.get(channelId);
  cached?.cancel();

  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(channelId, job);
 },
 delete: (guildId, channelId) => {
  const cached = self.cache.get(guildId)?.get(channelId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(channelId);
 },
 cache: new Map(),
};

export default self;
