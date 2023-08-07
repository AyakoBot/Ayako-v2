import * as Jobs from 'node-schedule';

export interface GiveawayClaimTimeout {
 set: (job: Jobs.Job, guildId: string, msgId: string) => void;
 delete: (guildId: string, msgId: string) => void;
 cache: Map<string, Map<string, Jobs.Job>>;
}

const self: GiveawayClaimTimeout = {
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
