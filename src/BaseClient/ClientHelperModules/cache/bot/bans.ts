import * as Jobs from 'node-schedule';

export interface Bans {
 set: (job: Jobs.Job, guildId: string, userId: string) => void;
 delete: (guildId: string, userId: string) => void;
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
