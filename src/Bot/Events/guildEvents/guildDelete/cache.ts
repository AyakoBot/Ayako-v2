import client from '../../../BaseClient/DDenoClient.js';

type ClearJobTypes =
  | 'giveawayClaimTimeout'
  | 'mutes'
  | 'bans'
  | 'channelBans'
  | 'giveaways'
  | 'channelTimeout';

type ClearCacheTypes =
  | 'verificationCodes'
  | 'webhooks'
  | 'automodRules'
  | 'emojis'
  | 'channelQueue'
  | 'channelCharLimit'
  | 'invites';

export default (id: bigint) => {
  ['giveawayClaimTimeout', 'mutes', 'bans', 'channelBans', 'giveaways', 'channelTimeout'].forEach(
    (t) => clearJob(t as unknown as ClearJobTypes, id),
  );

  [
    'verificationCodes',
    'webhooks',
    'automodRules',
    'emojis',
    'channelQueue',
    'channelCharLimit',
    'invites',
  ].forEach((t) => clearCache(t as unknown as ClearCacheTypes, id));

  client.disboardBumpReminders.get(id)?.cancel();
  client.disboardBumpReminders.delete(id);
};

const clearJob = (type: ClearJobTypes, id: bigint) => {
  const cache = client[type].get(id);
  if (cache) {
    Array.from(cache, ([, job]) => job).forEach((job) => job.cancel());
    cache.delete(id);
  }
  client[type].delete(id);
};

const clearCache = (type: ClearCacheTypes, id: bigint) => {
  const cache = client[type].get(id);
  if (cache) cache.clear();
  client[type].delete(id);
};
