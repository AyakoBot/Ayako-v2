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

 const { cache } = guild.client.util;
 cache.invites.cache.delete(guild.id);
 cache.webhooks.cache.delete(guild.id);
 cache.integrations.cache.delete(guild.id);
 cache.scheduledEventUsers.cache.delete(guild.id);
 cache.welcomeScreens.delete(guild.id);
 cache.pins.cache.delete(guild.id);
 cache.onboarding.delete(guild.id);
 cache.commandPermissions.cache.delete(guild.id);
 cache.auditLogs.cache.delete(guild.id);
 cache.giveawayClaimTimeout.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.giveawayClaimTimeout.cache.delete(guild.id);
 cache.mutes.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.mutes.cache.delete(guild.id);
 cache.bans.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.bans.cache.delete(guild.id);
 cache.channelBans.cache.delete(guild.id);
 cache.disboardBumpReminders.cache.get(guild.id)?.cancel();
 cache.disboardBumpReminders.cache.delete(guild.id);
 cache.giveaways.cache.delete(guild.id);
 cache.deleteThreads.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.deleteThreads.cache.delete(guild.id);
 cache.apis.delete(guild.id);
 cache.commands.cache.delete(guild.id);
 cache.deleteSuggestions.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.deleteSuggestions.cache.delete(guild.id);
 cache.vcDeleteTimeout.cache.get(guild.id)?.forEach((i) => i?.cancel());
 cache.vcDeleteTimeout.cache.delete(guild.id);
 cache.customClients.delete(guild.id);

 const { DataBase } = guild.client.util;
 DataBase.guilds.delete({ where: { guildid: guild.id } }).then();
 DataBase.noCommandsGuilds.delete({ where: { guildId: guild.id } }).then();
};
