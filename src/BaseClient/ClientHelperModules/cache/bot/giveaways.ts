import * as Jobs from 'node-schedule';

export interface Giveaways {
 set: (job: Jobs.Job, guildId: string, channelId: string, msgId: string) => void;
 delete: (guildId: string, channelId: string, msgId: string) => void;
 cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
}

const self: Giveaways = {
 set: (job, guildId, channelId, msgId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(msgId);
  cached?.cancel();

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(channelId)) {
   self.cache.get(guildId)?.set(channelId, new Map());
  }

  self.cache.get(guildId)?.get(channelId)?.set(msgId, job);
 },
 delete: (guildId, channelId, msgId) => {
  const cached = self.cache.get(guildId)?.get(channelId)?.get(msgId);
  cached?.cancel();

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else self.cache.get(guildId)?.get(channelId)?.delete(msgId);
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else self.cache.get(guildId)?.get(channelId)?.delete(msgId);
 },
 cache: new Map(),
};

export default self;
