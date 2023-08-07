import * as Jobs from 'node-schedule';

export interface StickyTimeouts {
 set: (channelId: string, job: Jobs.Job) => void;
 delete: (channelId: string) => void;
 cache: Map<string, Jobs.Job>;
}

const self: StickyTimeouts = {
 set: (channelId, job) => {
  const cached = self.cache.get(channelId);
  cached?.cancel();

  self.cache.set(channelId, job);
 },
 delete: (channelId) => {
  const cached = self.cache.get(channelId);
  cached?.cancel();
  self.cache.delete(channelId);
 },
 cache: new Map(),
};

export default self;
