import * as Jobs from 'node-schedule';

export interface Reminders {
 set: (job: Jobs.Job, userId: string, timestamp: number) => void;
 delete: (userId: string, timestamp: number) => void;
 cache: Map<string, Map<number, Jobs.Job>>;
}

const self: Reminders = {
 set: (job, userId, timestamp) => {
  const cached = self.cache.get(userId)?.get(timestamp);
  cached?.cancel();

  if (!self.cache.get(userId)) self.cache.set(userId, new Map());
  self.cache.get(userId)?.set(timestamp, job);
 },
 delete: (userId, timestamp) => {
  const cached = self.cache.get(userId)?.get(timestamp);
  cached?.cancel();

  if (self.cache.get(userId)?.size === 1) self.cache.delete(userId);
  else self.cache.get(userId)?.delete(timestamp);
 },
 cache: new Map(),
};

export default self;
