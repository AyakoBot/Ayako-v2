import Jobs from 'node-schedule';
import v8 from 'v8';
import client from '../../../../BaseClient/Bot/Client.js';
import memAnalyze from '../../../../BaseClient/UtilModules/memAnalyze.js';
import memWatch from '../../../../BaseClient/UtilModules/memWatch.js';

class ShardMemoryMonitor {
 private static isAnalyzing = false;
 private static memoryHistory: Array<{ timestamp: number; percentUsed: number }> = [];
 private static readonly MAX_HISTORY_SIZE = 12; // Keep last 12 readings (1 hour if checked every 5min)

 /**
  * Initialize shard-level memory monitoring
  */
 static initialize() {
  // Regular memory monitoring every 5 minutes
  Jobs.scheduleJob(`Shard ${client.cluster?.id} Memory Monitor`, '*/5 * * * *', () => {
   this.monitorShardMemory();
  });

  // Memory trend analysis every hour
  Jobs.scheduleJob(`Shard ${client.cluster?.id} Memory Trend`, '0 * * * *', () => {
   this.analyzeTrends();
  });

  // Deep analysis trigger
  Jobs.scheduleJob(`Shard ${client.cluster?.id} Critical Check`, '* * * * *', () => {
   this.checkCriticalConditions();
  });
 }

 /**
  * Perform regular memory monitoring
  */
 private static monitorShardMemory() {
  console.log(`[Shard ${client.cluster?.id} Memory Monitor]`);
  const percentUsed = memWatch(client);

  this.memoryHistory.push({ timestamp: Date.now(), percentUsed });

  if (this.memoryHistory.length > this.MAX_HISTORY_SIZE) {
   this.memoryHistory = this.memoryHistory.slice(-this.MAX_HISTORY_SIZE);
  }

  console.log(`[Shard ${client.cluster?.id}] Memory: ${percentUsed.toFixed(1)}%`);
 }

 /**
  * Check for critical memory conditions more frequently
  */
 private static checkCriticalConditions() {
  const heapStats = v8.getHeapStatistics();
  const percentUsed = (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;

  if (percentUsed > 88 && !this.isAnalyzing) {
   this.performDeepAnalysis();
  }

  if (percentUsed > 92) {
   this.emergencyCacheCleanup();
  }
 }

 /**
  * Analyze memory usage trends
  */
 private static analyzeTrends() {
  if (this.memoryHistory.length < 3) return;

  const recent = this.memoryHistory.slice(-3);
  const averageIncrease =
   recent.reduce((acc, curr, i) => {
    if (i === 0) return acc;
    return acc + (curr.percentUsed - recent[i - 1].percentUsed);
   }, 0) /
   (recent.length - 1);

  console.log(
   `[Shard ${client.cluster?.id} Memory Trend] Average change: ${averageIncrease.toFixed(2)}%`,
  );

  if (averageIncrease > 2) {
   console.warn(
    `⚠️  Shard ${client.cluster?.id} shows increasing memory trend: +${averageIncrease.toFixed(2)}% per check`,
   );
  }

  const hourAgo = this.memoryHistory[0];
  const current = this.memoryHistory[this.memoryHistory.length - 1];
  const hourlyChange = current.percentUsed - hourAgo.percentUsed;

  console.log(
   `[Shard ${client.cluster?.id}] Memory change over last hour: ${hourlyChange > 0 ? '+' : ''}${hourlyChange.toFixed(2)}%`,
  );
 }

 /**
  * Perform deep memory analysis
  */
 private static async performDeepAnalysis() {
  if (this.isAnalyzing) return;

  this.isAnalyzing = true;
  console.log(`[Shard ${client.cluster?.id}] Performing deep memory analysis...`);

  try {
   const analysis = await memAnalyze(`cluster${client.cluster?.id ?? 'unknown'}`);

   console.log(`\n=== Shard ${client.cluster?.id} Memory Analysis ===`);
   console.log(`Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
   console.log('Largest Objects:');

   analysis.largestObjects.slice(0, 5).forEach((obj, i) => {
    console.log(`${i + 1}. ${obj.name} (${obj.type}): ${(obj.size / 1024).toFixed(2)}KB`);
   });

   const cacheAnalysis = this.analyzeCacheSizes();
   console.log('\nCache Analysis:', cacheAnalysis);
  } catch (error) {
   console.error(`[Shard ${client.cluster?.id}] Deep analysis failed:`, error);
  } finally {
   setTimeout(
    () => {
     this.isAnalyzing = false;
    },
    10 * 60 * 1000,
   );
  }
 }

 /**
  * Analyze cache sizes for this shard
  */
 private static analyzeCacheSizes() {
  const caches = {
   // Discord.js caches
   users: client.users.cache.size,
   guilds: client.guilds.cache.size,
   channels: client.channels.cache.size,

   invites: client.util?.cache?.invites?.cache?.size ?? 0,
   webhooks: client.util?.cache?.webhooks?.cache?.size ?? 0,
   punishments: client.util?.cache?.punishments?.size ?? 0,
   antispam: client.util?.cache?.antispam?.size ?? 0,
   fastMsgCache: client.util?.cache?.fastMsgCache?.size ?? 0,
  };

  const sortedCaches = Object.entries(caches)
   .sort(([, a], [, b]) => b - a)
   .slice(0, 5);

  return {
   total: Object.values(caches).reduce((sum, size) => sum + size, 0),
   largest: Object.fromEntries(sortedCaches),
  };
 }

 /**
  * Emergency cache cleanup for critical memory situations
  */
 private static emergencyCacheCleanup() {
  console.warn(`🚨 [Shard ${client.cluster?.id}] Emergency cache cleanup triggered!`);

  try {
   if (global.gc) {
    global.gc();
   }

   if (client.util?.cache) {
    const cache = client.util.cache;

    cache.fastMsgCache?.clear();
    cache.cooldown?.clear();
    cache.levellingCD?.clear();

    console.log(`[Shard ${client.cluster?.id}] Emergency cleanup completed`);
   }
  } catch (error) {
   console.error(`[Shard ${client.cluster?.id}] Emergency cleanup failed:`, error);
  }
 }

 /**
  * Get current memory statistics for this shard
  */
 static getCurrentStats() {
  const heapStats = v8.getHeapStatistics();

  return {
   shardId: client.cluster?.id ?? 0,
   percentUsed: (heapStats.used_heap_size / heapStats.heap_size_limit) * 100,
   usedHeapMB: heapStats.used_heap_size / 1024 / 1024,
   totalHeapMB: heapStats.heap_size_limit / 1024 / 1024,
   history: this.memoryHistory.slice(),
  };
 }
}

export default ShardMemoryMonitor;
