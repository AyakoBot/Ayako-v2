import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import cache from '../ClientHelperModules/cache.js';
import error from '../ClientHelperModules/error.js';
import fetchAllEventSubscribers from '../ClientHelperModules/fetchAllEventSubscribers.js';
import fetchAllGuildMembers from '../ClientHelperModules/fetchAllGuildMembers.js';
import deleteThread from '../ClientHelperModules/mod/deleteThread.js';
import { request } from '../ClientHelperModules/requestHandler.js';
import DataBase from '../DataBase.js';

export default async (guild: Discord.Guild | null) => {
 if (!guild) return;
 if (!(guild instanceof Discord.Guild)) return;

 if (cache.interactedGuilds.has(guild.id)) return;
 cache.interactedGuilds.add(guild.id);

 Object.values(tasks).forEach((t) => t(guild));
};

const tasks = {
 deleteThreads: async (guild: Discord.Guild) => {
  if (!guild.rulesChannel) return;
  const deleteThreads = await DataBase.deletethreads.findMany({
   where: { guildid: guild.id },
  });
  deleteThreads?.forEach((t) => {
   cache.deleteThreads.set(
    Jobs.scheduleJob(
     new Date(Number(t.deletetime) < Date.now() ? Date.now() + 10000 : Number(t.deletetime)),
     () => {
      deleteThread(guild, t.channelid);
     },
    ),
    t.guildid,
    t.channelid,
   );
  });
 },
 autoModRules: async (guild: Discord.Guild) => {
  request.guilds.getAutoModerationRules(guild);
 },
 scheduledEvents: async (guild: Discord.Guild) => {
  const scheduledEvents = await request.guilds.getScheduledEvents(guild);
  if ('message' in scheduledEvents) {
   error(guild, scheduledEvents);
   return;
  }
  scheduledEvents.forEach(async (event) => {
   const users = await fetchAllEventSubscribers(event);
   users?.forEach((u) => {
    cache.scheduledEventUsers.add(u.user, guild.id, event.id);
   });
  });
 },
 welcomeScreen: async (guild: Discord.Guild) => {
  if (guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
   cache.welcomeScreens.get(guild);
  }
 },
 invites: async (guild: Discord.Guild) => {
  cache.invites.get('', '', guild);

  const vanity = await request.guilds.getVanityURL(guild);
  if (vanity && !('message' in vanity)) cache.invites.set(vanity, guild.id);
 },
 integrations: async (guild: Discord.Guild) => {
  cache.integrations.get('', guild);
 },
 commands: async (guild: Discord.Guild) => {
  request.commands.getGuildCommands(guild);
 },
 members: async (guild: Discord.Guild) => {
  fetchAllGuildMembers(guild);
 },
 commandPermissions: async (guild: Discord.Guild) => {
  cache.commandPermissions.get(guild, '');
 },
 webhooks: async (guild: Discord.Guild) => {
  cache.webhooks.get('', '', guild);
 },
};
