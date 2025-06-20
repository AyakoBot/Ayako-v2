import Prisma, { type PrismaPromise } from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import DataBase from '../Bot/DataBase.js';
import metricsCollector from '../Bot/Metrics.js';
import cache from '../UtilModules/cache.js';
import deleteThread from '../UtilModules/deleteNotificationThread.js';
import error from '../UtilModules/error.js';
import fetchAllEventSubscribers from '../UtilModules/fetchAllEventSubscribers.js';
import fetchAllGuildMembers from '../UtilModules/fetchAllGuildMembers.js';
import getPathFromError from '../UtilModules/getPathFromError.js';
import { request } from '../UtilModules/requestHandler.js';

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
 vcStatus: (guild: Discord.Guild) => {
  guild.client.util.request.channels.requestVCStatus(guild);
 },
 customClient: async (guild: Discord.Guild) => {
  const settings = await guild.client.util.DataBase.customclients.findUnique({
   where: { token: { not: null }, guildid: guild.id },
  });
  if (!settings) return;

  const apiCreated = await guild.client.util.requestHandler(guild.id, settings.token as string);
  if (!apiCreated) return;

  guild.client.util.request.commands.getGlobalCommands(guild, guild.client);
 },
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
  const members = await fetchAllGuildMembers(guild);
  if (!members.length) return;

  const queries: PrismaPromise<unknown>[] = [];

  const runningNitroUsers = await guild.client.util.DataBase.nitrousers.findMany({
   where: { guildid: guild.id, boostend: null },
  });

  runningNitroUsers.forEach((user) => {
   const member = members.find((m) => m.id === user.userid);
   if (member && member.premiumSinceTimestamp) {
    if (Number(user.booststart) === member.premiumSinceTimestamp) return;

    queries.push(
     guild.client.util.DataBase.nitrousers.updateMany({
      where: { guildid: guild.id, userid: user.userid, boostend: null },
      data: { boostend: member.premiumSinceTimestamp },
     }),
     guild.client.util.DataBase.nitrousers.create({
      data: {
       guildid: guild.id,
       userid: user.userid,
       booststart: member.premiumSinceTimestamp,
       boostend: null,
      },
     }),
    );
   }

   queries.push(
    guild.client.util.DataBase.nitrousers.updateMany({
     where: { guildid: guild.id, userid: user.userid, boostend: null },
     data: { boostend: Date.now() },
    }),
   );
  });

  const endedNitroUsers = await guild.client.util.DataBase.nitrousers
   .findMany({
    where: { guildid: guild.id, boostend: { not: null } },
   })
   .then((users) =>
    users.reduce((acc, user) => {
     const existingUser = acc.find((u) => u.userid === user.userid);
     if (!existingUser || Number(existingUser.boostend) < Number(user.boostend)) {
      return [...acc.filter((u) => u.userid !== user.userid), user];
     }
     return acc;
    }, [] as Prisma.nitrousers[]),
   );

  endedNitroUsers.forEach((user) => {
   const member = members.find((m) => m.id === user.userid); 
   if (!member) return;
   if (!member.premiumSinceTimestamp) return;

   queries.push(
    guild.client.util.DataBase.nitrousers.upsert({
     where: { guildid: guild.id, userid: user.userid, booststart: member.premiumSinceTimestamp },
     update: { boostend: null },
     create: {
      booststart: member.premiumSinceTimestamp,
      boostend: null,
      guildid: guild.id,
      userid: user.userid,
     },
    }),
   );
  });

  if (!queries.length) return;
  guild.client.util.DataBase.$transaction(queries).then();
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
 webhooks: async (guild: Discord.Guild) => {
  guild.client.util.request.guilds.getWebhooks(guild);
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
