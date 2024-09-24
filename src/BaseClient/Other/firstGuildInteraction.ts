import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import Prisma from '@prisma/client';

import cache from '../UtilModules/cache.js';
import error from '../UtilModules/error.js';
import fetchAllEventSubscribers from '../UtilModules/fetchAllEventSubscribers.js';
import fetchAllGuildMembers from '../UtilModules/fetchAllGuildMembers.js';
import deleteThread from '../UtilModules/deleteNotificationThread.js';
import { request } from '../UtilModules/requestHandler.js';
import DataBase from '../Bot/DataBase.js';
import getPathFromError from '../UtilModules/getPathFromError.js';
import metricsCollector from '../Bot/Metrics.js';

export default async (guild: Discord.Guild | null, eventName: string) => {
 if (!guild) return;
 if (!guild.roles.everyone) return;
 if (!(guild instanceof Discord.Guild)) return;

 metrics(guild, eventName);

 await guild.client.util.request.guilds.getMember(
  guild,
  await guild.client.util.getBotIdFromGuild(guild),
 );

 if (cache.interactedGuilds.has(guild.id)) return;
 cache.interactedGuilds.add(guild.id);

 const settings = await guild.client.util.DataBase.logchannels.findUnique({
  where: { guildid: guild.id },
 });

 Object.values(tasks).forEach((t) => t(guild));
 Object.values(tasksWithSettings).forEach((t) => t(guild, settings));
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
     getPathFromError(new Error(t.channelid)),
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
 commands: async (guild: Discord.Guild) => {
  request.commands.getGuildCommands(guild);
 },
 members: async (guild: Discord.Guild) => {
  fetchAllGuildMembers(guild);
 },
 commandPermissions: async (guild: Discord.Guild) => {
  cache.commandPermissions.get(guild, '');
 },
};

export const tasksWithSettings = {
 welcomeScreen: async (guild: Discord.Guild, settings: Prisma.logchannels | null) => {
  if (!settings?.guildevents?.length) return;

  if (guild.features?.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
   cache.welcomeScreens.get(guild);
  }
 },
 scheduledEvents: async (guild: Discord.Guild, settings: Prisma.logchannels | null) => {
  if (!settings?.scheduledeventevents?.length) return;

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
 webhooks: async (guild: Discord.Guild, settings: Prisma.logchannels | null) => {
  if (!settings?.webhookevents?.length) return;

  cache.webhooks.get('', '', guild);
 },
 integrations: async (guild: Discord.Guild, settings: Prisma.logchannels | null) => {
  if (!settings?.guildevents?.length) return;

  cache.integrations.get('', guild);
 },
 invites: async (guild: Discord.Guild, settings: Prisma.logchannels | null) => {
  if (!settings?.inviteevents?.length && !settings?.memberevents?.length) return;

  cache.invites.get('', '', guild);

  const vanity = await request.guilds.getVanityURL(guild);
  if (vanity && !('message' in vanity)) {
   if (!vanity.channelId) vanity.channelId = guild.channels.cache.first()?.id ?? null;
   if (!vanity.channel) {
    vanity.channel =
     guild.channels.cache
      .filter(
       (c): c is Discord.NonThreadGuildBasedChannel =>
        c.isTextBased() && !c.isThread() && !c.isDMBased(),
      )
      .first() ?? null;
   }
   cache.invites.set(vanity, guild.id);
  }
 },
};

const metrics = async (guild: Discord.Guild, eventName: string) => {
 const botId = await guild.client.util.getBotIdFromGuild(guild);
 const bot = await guild.client.util.getUser(botId);

 metricsCollector.dispatchEventsReceived(
  bot?.username ?? 'Unknown',
  eventName,
  guild.client.cluster?.id ?? 0,
 );
};
