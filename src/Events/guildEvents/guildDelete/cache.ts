import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default (guild: Discord.Guild) => {
  const giveawayClaimTimeouts = client.cache.giveawayClaimTimeout.cache.get(guild.id);
  const mutes = client.cache.mutes.cache.get(guild.id);
  const bans = client.cache.bans.cache.get(guild.id);
  const channelBans = client.cache.channelBans.cache.get(guild.id);
  const giveaways = client.cache.giveaways.cache.get(guild.id);

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

  client.cache.scheduledEventUsers.cache.delete(guild.id);
  client.cache.giveawayClaimTimeout.cache.delete(guild.id);
  client.cache.mutes.cache.delete(guild.id);
  client.cache.bans.cache.delete(guild.id);
  client.cache.channelBans.cache.delete(guild.id);
  client.cache.disboardBumpReminders.cache.get(guild.id)?.cancel();
  client.cache.disboardBumpReminders.cache.delete(guild.id);
  client.cache.verificationCodes.cache.delete(guild.id);
  client.cache.giveaways.cache.delete(guild.id);
  client.cache.invites.cache.delete(guild.id);
  client.cache.webhooks.cache.delete(guild.id);
  client.cache.integrations.cache.delete(guild.id);
  client.cache.welcomeScreens.delete(guild.id);
};
