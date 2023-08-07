import * as Jobs from 'node-schedule';

export interface DisboardBumpReminders {
 set: (job: Jobs.Job, guildId: string) => void;
 delete: (guildId: string) => void;
 cache: Map<string, Jobs.Job>;
}

const self: DisboardBumpReminders = {
 set: (job, guildId) => {
  const cached = self.cache.get(guildId);
  cached?.cancel();

  self.cache.set(guildId, job);
 },
 delete: (guildId) => {
  const cached = self.cache.get(guildId);
  cached?.cancel();
  self.cache.delete(guildId);
 },
 cache: new Map(),
};

export default self;
