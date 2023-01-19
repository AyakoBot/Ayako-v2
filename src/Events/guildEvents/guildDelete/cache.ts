import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default (guild: Discord.Guild) => {
  const giveawayClaimTimeouts = client.ch.cache.giveawayClaimTimeout.cache.get(guild.id);
  const mutes = client.ch.cache.mutes.cache.get(guild.id);
  const bans = client.ch.cache.bans.cache.get(guild.id);
  const channelBans = client.ch.cache.channelBans.cache.get(guild.id);
  const giveaways = client.ch.cache.giveaways.cache.get(guild.id);

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

  client.ch.cache.scheduledEventUsers.cache.delete(guild.id);
  client.ch.cache.giveawayClaimTimeout.cache.delete(guild.id);
  client.ch.cache.mutes.cache.delete(guild.id);
  client.ch.cache.bans.cache.delete(guild.id);
  client.ch.cache.channelBans.cache.delete(guild.id);
  client.ch.cache.disboardBumpReminders.cache.get(guild.id)?.cancel();
  client.ch.cache.disboardBumpReminders.cache.delete(guild.id);
  client.ch.cache.verificationCodes.cache.delete(guild.id);
  client.ch.cache.giveaways.cache.delete(guild.id);
  client.ch.cache.invites.cache.delete(guild.id);
  client.ch.cache.webhooks.cache.delete(guild.id);
  client.ch.cache.integrations.cache.delete(guild.id);
  client.ch.cache.welcomeScreens.delete(guild.id);
};
