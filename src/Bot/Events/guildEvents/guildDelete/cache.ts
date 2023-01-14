import client from '../../../BaseClient/DDenoClient.js';

export default (id: bigint) => {
  const giveawayClaimTimeouts = client.ch.cache.giveawayClaimTimeout.cache.get(id);
  const mutes = client.ch.cache.mutes.cache.get(id);
  const bans = client.ch.cache.bans.cache.get(id);
  const channelBans = client.ch.cache.channelBans.cache.get(id);
  const giveaways = client.ch.cache.giveaways.cache.get(id);

  if (giveawayClaimTimeouts) {
    Array.from(giveawayClaimTimeouts, ([, i]) => i).forEach((i) => i.cancel());
  }
  if (channelBans) {
    Array.from(channelBans, ([, i]) => i).forEach((i) =>
      Array.from(i, ([, g]) => g).forEach((g) => g.cancel()),
    );
  }
  if (mutes) Array.from(mutes, ([, i]) => i).forEach((i) => i.cancel());
  if (bans) Array.from(bans, ([, i]) => i).forEach((i) => i.cancel());
  if (giveaways) {
    Array.from(giveaways, ([, i]) => i).forEach((i) =>
      Array.from(i, ([, g]) => g).forEach((g) => g.cancel()),
    );
  }

  client.ch.cache.giveawayClaimTimeout.cache.delete(id);
  client.ch.cache.mutes.cache.delete(id);
  client.ch.cache.bans.cache.delete(id);
  client.ch.cache.channelBans.cache.delete(id);
  client.ch.cache.disboardBumpReminders.cache.get(id)?.cancel();
  client.ch.cache.disboardBumpReminders.cache.delete(id);
  client.ch.cache.verificationCodes.cache.delete(id);
  client.ch.cache.giveaways.cache.delete(id);
  client.ch.cache.scheduledEvents.cache.delete(id);
  client.ch.cache.stageInstances.cache.delete(id);
  client.ch.cache.threads.cache.delete(id);
  client.ch.cache.members.cache.delete(id);
  client.ch.cache.invites.cache.delete(id);
  client.ch.cache.webhooks.cache.delete(id);
  client.ch.cache.automodRules.cache.delete(id);
  client.ch.cache.emojis.cache.delete(id);
  client.ch.cache.integrations.cache.delete(id);
  client.ch.cache.reactions.cache.delete(id);
  client.ch.cache.roles.cache.delete(id);
  client.ch.cache.channels.cache.delete(id);
  client.ch.cache.guilds.cache.delete(id);
  client.ch.cache.messages.cache.delete(id);
  client.ch.cache.stickers.cache.delete(id);
  client.ch.cache.voiceStates.cache.delete(id);
};
