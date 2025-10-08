import type { Client } from 'discord.js';
import v8 from 'v8';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (client: Client) => {
 const heapStats = v8.getHeapStatistics();
 const usedHeap = heapStats.used_heap_size / 1024 / 1024; // MB
 const totalHeap = heapStats.heap_size_limit / 1024 / 1024; // MB
 const percentUsed = (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;

 // Create timestamp and log file name
 const now = new Date();
 const day = now.getDate().toString().padStart(2, '0');
 const month = (now.getMonth() + 1).toString().padStart(2, '0');
 const year = now.getFullYear();
 const hours = now.getHours().toString().padStart(2, '0');
 const minutes = now.getMinutes().toString().padStart(2, '0');
 
 // Determine if this is manager or shard, and add appropriate suffix
 const isManager = !client || !client.cluster;
 const suffix = isManager ? '-manager' : `-cluster${client.cluster?.id ?? 'unknown'}`;
 const logFileName = `${day}-${month}-${year}-${hours}-${minutes}${suffix}.log`;
 const logFilePath = path.join(__dirname, '../../../logs/analysis', logFileName);

 // Ensure analysis directory exists
 const analysisDir = path.dirname(logFilePath);
 if (!fs.existsSync(analysisDir)) {
  fs.mkdirSync(analysisDir, { recursive: true });
 }

 // Prepare log entries
 const logEntries: string[] = [];
 const timestamp = now.toISOString();

 logEntries.push(`[${timestamp}] Memory Watch Report`);
 logEntries.push(`[${timestamp}] ===================`);

 const shardInfo = client?.cluster?.id !== undefined ? ` [Shard ${client.cluster.id}]` : '';
 const memoryLog = `Memory${shardInfo}: ${usedHeap.toFixed(2)}MB / ${totalHeap.toFixed(2)}MB (${percentUsed.toFixed(1)}%)`;
 console.log(memoryLog);
 logEntries.push(`[${timestamp}] ${memoryLog}`);

 const heapSpaces = v8.getHeapSpaceStatistics();
 const largestSpaces = heapSpaces.sort((a, b) => b.space_used_size - a.space_used_size).slice(0, 3);

 console.log('Top memory spaces:');
 logEntries.push(`[${timestamp}] Top memory spaces:`);
 largestSpaces.forEach((space) => {
  const spaceLog = `  ${space.space_name}: ${(space.space_used_size / 1024 / 1024).toFixed(2)}MB`;
  console.log(spaceLog);
  logEntries.push(`[${timestamp}] ${spaceLog}`);
 });

 if (global.gc) {
  global.gc();

  console.log('Object tracking:');
  logEntries.push(`[${timestamp}] Object tracking:`);

  if (client) {
   const discordUsers = `  Discord Users: ${client.users.cache.size}`;
   const discordGuilds = `  Discord Guilds: ${client.guilds.cache.size}`;
   const discordChannels = `  Discord Channels: ${client.channels.cache.size}`;

   console.log(discordUsers);
   console.log(discordGuilds);
   console.log(discordChannels);

   logEntries.push(`[${timestamp}] ${discordUsers}`);
   logEntries.push(`[${timestamp}] ${discordGuilds}`);
   logEntries.push(`[${timestamp}] ${discordChannels}`);

   let totalMessages = 0;
   client.channels.cache.forEach((channel) => {
    if (!('messages' in channel)) return;
    if (channel.messages) totalMessages += channel.messages.cache.size;
   });
   const cachedMessages = `  Cached Messages: ${totalMessages}`;
   console.log(cachedMessages);
   logEntries.push(`[${timestamp}] ${cachedMessages}`);
  }

  const cacheStats = [
   `  Cache invites: ${client.util.cache.invites.cache.size}`,
   `  Cache webhooks: ${client.util.cache.webhooks.cache.size}`,
   `  Cache integrations: ${client.util.cache.integrations.cache.size}`,
   `  Cache scheduledEventUsers: ${client.util.cache.scheduledEventUsers.cache.size}`,
   `  Cache welcomeScreens: ${client.util.cache.welcomeScreens.cache.size}`,
   `  Cache pins: ${client.util.cache.pins.cache.size}`,
   `  Cache inviteGuilds: ${client.util.cache.inviteGuilds.cache.size}`,
   `  Cache onboarding: ${client.util.cache.onboarding.cache.size}`,
   `  Cache commandPermissions: ${client.util.cache.commandPermissions.cache.size}`,
   `  Cache interactedGuilds: ${client.util.cache.interactedGuilds.size}`,
  ];

  cacheStats.forEach((stat) => {
   console.log(stat);
   logEntries.push(`[${timestamp}] ${stat}`);
  });

  const moreCacheStats = [
   `  Cache interactedChannels: ${client.util.cache.interactedChannels.size}`,
   `  Cache customClients: ${client.util.cache.customClients.size}`,
   `  Cache voiceChannelStatus: ${client.util.cache.voiceChannelStatus.size}`,
   `  Cache giveawayClaimTimeout: ${client.util.cache.giveawayClaimTimeout.cache.size}`,
   `  Cache mutes: ${client.util.cache.mutes.cache.size}`,
   `  Cache vcMutes: ${client.util.cache.vcMutes.cache.size}`,
   `  Cache vcDeafens: ${client.util.cache.vcDeafens.cache.size}`,
   `  Cache bans: ${client.util.cache.bans.cache.size}`,
   `  Cache channelBans: ${client.util.cache.channelBans.cache.size}`,
   `  Cache disboardBumpReminders: ${client.util.cache.disboardBumpReminders.cache.size}`,
   `  Cache votes: ${client.util.cache.votes.cache.size}`,
   `  Cache giveaways: ${client.util.cache.giveaways.cache.size}`,
   `  Cache stickyTimeouts: ${client.util.cache.stickyTimeouts.cache.size}`,
   `  Cache auditLogs: ${client.util.cache.auditLogs.cache.size}`,
   `  Cache deleteThreads: ${client.util.cache.deleteThreads.cache.size}`,
   `  Cache apis: ${client.util.cache.apis.size}`,
   `  Cache commands: ${client.util.cache.commands.cache.size}`,
   `  Cache punishments: ${client.util.cache.punishments.size}`,
   `  Cache antispam: ${client.util.cache.antispam.size}`,
   `  Cache deleteSuggestions: ${client.util.cache.deleteSuggestions.cache.size}`,
   `  Cache vcDeleteTimeout: ${client.util.cache.vcDeleteTimeout.cache.size}`,
   `  Cache fastMsgCache: ${client.util.cache.fastMsgCache.size}`,
   `  Cache interactionInstallmentRunningFor: ${client.util.cache.interactionInstallmentRunningFor.size}`,
   `  Cache unblockedModUsers: ${client.util.cache.unblockedModUsers.cache.length}`,
   `  Cache gifs: ${client.util.cache.gifs.length}`,
   `  Cache hasFetchedAllMembers: ${client.util.cache.hasFetchedAllMembers.size}`,
   `  Cache urlTLDs: ${client.util.cache.urlTLDs.cache.size}`,
   `  Cache sinkingYachts: ${client.util.cache.sinkingYachts.cache.size}`,
   `  Cache fishFish: ${client.util.cache.fishFish.cache.size}`,
   `  Cache reportedURLs: ${client.util.cache.reportedURLs.size}`,
   `  Cache globalLevellingCD: ${client.util.cache.globalLevellingCD.size}`,
   `  Cache guildLevellingCD: ${client.util.cache.guildLevellingCD.size}`,
   `  Cache levellingCD: ${client.util.cache.levellingCD.size}`,
   `  Cache lastMessageGlobal: ${client.util.cache.lastMessageGlobal.size}`,
   `  Cache lastMessageGuild: ${client.util.cache.lastMessageGuild.size}`,
   `  Cache afkCD: ${client.util.cache.afkCD.size}`,
   `  Cache cooldown: ${client.util.cache.cooldown.size}`,
   `  Cache antiraid: ${client.util.cache.antiraid.size}`,
   `  Cache antiraidQueued: ${client.util.cache.antiraidQueued.size}`,
   `  Cache enableInvites: ${client.util.cache.enableInvites.size}`,
   `  Cache separatorAssigner: ${client.util.cache.separatorAssigner.size}`,
   `  Cache channelQueue: ${client.util.cache.channelQueue.size}`,
  ];

  moreCacheStats.forEach((stat) => {
   console.log(stat);
   logEntries.push(`[${timestamp}] ${stat}`);
  });
 }

 // Critical check
 if (percentUsed > 90) {
  const shardInfo = client?.cluster?.id !== undefined ? `shard-${client.cluster.id}-` : '';
  const memoryWarning = `  MEMORY WARNING${client?.cluster?.id !== undefined ? ` [Shard ${client.cluster.id}]` : ''}: Creating heap snapshot for analysis...`;
  console.log(memoryWarning);
  logEntries.push(`[${timestamp}] ${memoryWarning}`);

  const fileName = `/apps/Ayako/packages/Bot/logs/heap/heap-${shardInfo}${Date.now()}.heapsnapshot`;
  v8.writeHeapSnapshot(fileName);
  const heapSaved = `  Heap snapshot saved to ${fileName}`;
  console.log(heapSaved);
  logEntries.push(`[${timestamp}] ${heapSaved}`);

  if (percentUsed > 95) {
   const criticalError = `  CRITICAL${client?.cluster?.id !== undefined ? ` [Shard ${client.cluster.id}]` : ''}: Memory >95%, forcing exit`;
   console.error(criticalError);
   logEntries.push(`[${timestamp}] ${criticalError}`);

   // Write logs before exiting
   try {
    fs.appendFileSync(logFilePath, logEntries.join('\n') + '\n');
   } catch (error) {
    console.error('Failed to write analysis log:', error);
   }

   process.exit(137);
  }
 }

 // Write all log entries to file
 logEntries.push(`[${timestamp}] Memory watch complete\n`);
 try {
  fs.appendFileSync(logFilePath, logEntries.join('\n') + '\n');
 } catch (error) {
  console.error('Failed to write analysis log:', error);
 }

 return percentUsed;
};
