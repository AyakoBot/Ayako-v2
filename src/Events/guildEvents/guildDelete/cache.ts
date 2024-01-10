import type * as Discord from 'discord.js';

export default (guild: Discord.Guild) => {
 const giveawayClaimTimeouts = guild.client.util.cache.giveawayClaimTimeout.cache.get(guild.id);
 const mutes = guild.client.util.cache.mutes.cache.get(guild.id);
 const bans = guild.client.util.cache.bans.cache.get(guild.id);
 const channelBans = guild.client.util.cache.channelBans.cache.get(guild.id);
 const giveaways = guild.client.util.cache.giveaways.cache.get(guild.id);

 if (giveawayClaimTimeouts) {
  Array.from(giveawayClaimTimeouts, ([, i]) => i).forEach((i) => i?.cancel());
 }
 if (channelBans) {
  Array.from(channelBans, ([, i]) => i).forEach((i) =>
   Array.from(i, ([, g]) => g).forEach((g) => g?.cancel()),
  );
 }
 if (mutes) Array.from(mutes, ([, i]) => i).forEach((i) => i?.cancel());
 if (bans) Array.from(bans, ([, i]) => i).forEach((i) => i?.cancel());
 if (giveaways) {
  Array.from(giveaways, ([, i]) => i).forEach((i) =>
   Array.from(i, ([, g]) => g).forEach((g) => g?.cancel()),
  );
 }

 guild.client.util.cache.channelBans.cache
  .get(guild.id)
  ?.forEach((i) => i.forEach((j) => j?.cancel()));
 guild.client.util.cache.giveaways.cache
  .get(guild.id)
  ?.forEach((i) => i.forEach((j) => j?.cancel()));

 guild.client.util.cache.invites.cache.delete(guild.id);
 guild.client.util.cache.webhooks.cache.delete(guild.id);
 guild.client.util.cache.integrations.cache.delete(guild.id);
 guild.client.util.cache.scheduledEventUsers.cache.delete(guild.id);
 guild.client.util.cache.welcomeScreens.delete(guild.id);
 guild.client.util.cache.pins.cache.delete(guild.id);
 guild.client.util.cache.onboarding.delete(guild.id);
 guild.client.util.cache.commandPermissions.cache.delete(guild.id);
 guild.client.util.cache.auditLogs.cache.delete(guild.id);
 guild.client.util.cache.giveawayClaimTimeout.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.giveawayClaimTimeout.cache.delete(guild.id);
 guild.client.util.cache.mutes.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.mutes.cache.delete(guild.id);
 guild.client.util.cache.bans.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.bans.cache.delete(guild.id);
 guild.client.util.cache.channelBans.cache.delete(guild.id);
 guild.client.util.cache.disboardBumpReminders.cache.get(guild.id)?.cancel();
 guild.client.util.cache.disboardBumpReminders.cache.delete(guild.id);
 guild.client.util.cache.giveaways.cache.delete(guild.id);
 guild.client.util.cache.deleteThreads.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.deleteThreads.cache.delete(guild.id);
 guild.client.util.cache.apis.delete(guild.id);
 guild.client.util.cache.commands.cache.delete(guild.id);
 guild.client.util.cache.deleteSuggestions.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.deleteSuggestions.cache.delete(guild.id);
 guild.client.util.cache.vcDeleteTimeout.cache.get(guild.id)?.forEach((i) => i?.cancel());
 guild.client.util.cache.vcDeleteTimeout.cache.delete(guild.id);
};
