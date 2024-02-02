import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import DataBase from '../Bot/DataBase.js';

export default async (guild: Discord.Guild | null) => {
 if (!guild) return;
 if (!(guild instanceof Discord.Guild)) return;

 if (guild.client.util.cache.interactedGuilds.has(guild.id)) return;
 guild.client.util.cache.interactedGuilds.add(guild.id);

 Object.values(tasks).forEach((t) => t(guild));
};

const tasks = {
 deleteThreads: async (guild: Discord.Guild) => {
  if (!guild.rulesChannel) return;
  const deleteThreads = await DataBase.deletethreads.findMany({
   where: { guildid: guild.id },
  });
  deleteThreads?.forEach((t) => {
   guild.client.util.cache.deleteThreads.set(
    Jobs.scheduleJob(
     new Date(Number(t.deletetime) < Date.now() ? Date.now() + 10000 : Number(t.deletetime)),
     () => {
      guild.client.util.deleteNotificationThread(guild, t.channelid);
     },
    ),
    t.guildid,
    t.channelid,
   );
  });
 },
 autoModRules: async (guild: Discord.Guild) => {
  guild.client.util.request.guilds.getAutoModerationRules(guild);
 },
 scheduledEvents: async (guild: Discord.Guild) => {
  const scheduledEvents = await guild.client.util.request.guilds.getScheduledEvents(guild);
  if ('message' in scheduledEvents) {
   guild.client.util.error(guild, scheduledEvents);
   return;
  }
  scheduledEvents.forEach(async (event) => {
   const users = await guild.client.util.fetchAllEventSubscribers(event);
   users?.forEach((u) => {
    guild.client.util.cache.scheduledEventUsers.add(u.user, guild.id, event.id);
   });
  });
 },
 welcomeScreen: async (guild: Discord.Guild) => {
  if (guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
   guild.client.util.cache.welcomeScreens.get(guild);
  }
 },
 invites: async (guild: Discord.Guild) => {
  guild.client.util.cache.invites.get('', '', guild);

  const vanity = await guild.client.util.request.guilds.getVanityURL(guild);
  if (vanity && !('message' in vanity)) guild.client.util.cache.invites.set(vanity, guild.id);
 },
 integrations: async (guild: Discord.Guild) => {
  guild.client.util.cache.integrations.get('', guild);
 },
 commands: async (guild: Discord.Guild) => {
  guild.client.util.request.commands.getGuildCommands(guild);
 },
 members: async (guild: Discord.Guild) => {
  guild.client.util.fetchAllGuildMembers(guild);
 },
 commandPermissions: async (guild: Discord.Guild) => {
  guild.client.util.cache.commandPermissions.get(guild, '');
 },
 webhooks: async (guild: Discord.Guild) => {
  guild.client.util.cache.webhooks.get('', '', guild);
 },
};
