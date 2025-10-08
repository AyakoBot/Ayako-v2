import memWatch from '../UtilModules/memWatch.js';
import memAnalyze from '../UtilModules/memAnalyze.js';
import Jobs from 'node-schedule';

class ManagerMemoryMonitor {
 private static isAnalyzing = false;

 /**
  * Initialize memory monitoring for the cluster manager process
  */
 static initialize() {
  // Monitor manager process memory every 5 minutes
  Jobs.scheduleJob('Manager Memory Monitor', '*/5 * * * *', () => {
   this.monitorManagerMemory();
  });

  // Cross-shard memory reporting every 30 minutes
  Jobs.scheduleJob('Cross-Shard Memory Report', '*/30 * * * *', () => {
   this.crossShardMemoryReport();
  });
 }

 /**
  * Monitor the manager process itself
  */
 private static monitorManagerMemory() {
  console.log('[Manager Memory Monitor]');
  const percentUsed = memWatch({ user: null } as any); // Manager doesn't have Discord client

  if (percentUsed > 85 && !this.isAnalyzing) {
   this.performDeepAnalysis();
  }
 }

 /**
  * Collect memory stats from all shards
  */
 private static async crossShardMemoryReport() {
  try {
   const Manager = (await import('./Manager.js')).default;

   const shardMemoryStats = await Manager.broadcastEval((client) => {
    const v8 = eval('require')('v8');
    const heapStats = v8.getHeapStatistics();
    const percentUsed = (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;

    return {
     shardId: client.cluster?.id ?? 0,
     usedHeapMB: Math.round((heapStats.used_heap_size / 1024 / 1024) * 100) / 100,
     totalHeapMB: Math.round((heapStats.heap_size_limit / 1024 / 1024) * 100) / 100,
     percentUsed: Math.round(percentUsed * 100) / 100,
     guildCount: client.guilds?.cache.size ?? 0,
     userCount: client.users?.cache.size ?? 0,
    };
   });

   console.log('\n=== Cross-Shard Memory Report ===');
   let totalMemoryMB = 0;
   let criticalShards = 0;

   shardMemoryStats.forEach((stats: any) => {
    totalMemoryMB += stats.usedHeapMB;
    console.log(
     `Shard ${stats.shardId}: ${stats.usedHeapMB}MB/${stats.totalHeapMB}MB (${stats.percentUsed}%) | Guilds: ${stats.guildCount} | Users: ${stats.userCount}`,
    );

    if (stats.percentUsed > 90) {
     criticalShards++;
     console.warn(`⚠️  Shard ${stats.shardId} is using >90% memory!`);
    }
   });

   console.log(`Total Bot Memory Usage: ${totalMemoryMB.toFixed(2)}MB`);

   if (criticalShards > 0) {
    console.error(`🚨 ${criticalShards} shard(s) in critical memory state!`);
   }
  } catch (error) {
   console.error('[Manager Memory Monitor] Failed to collect shard memory stats:', error);
  }
 }

 /**
  * Perform deep memory analysis on manager process
  */
 private static async performDeepAnalysis() {
  if (this.isAnalyzing) return;

  this.isAnalyzing = true;
  console.log('[Manager Memory Monitor] Performing deep analysis...');

  try {
   const analysis = await memAnalyze('manager');

   console.log('\n=== Manager Memory Analysis ===');
   console.log(`Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
   console.log('Largest Objects:');

   analysis.largestObjects.slice(0, 10).forEach((obj, i) => {
    console.log(`${i + 1}. ${obj.name} (${obj.type}): ${(obj.size / 1024).toFixed(2)}KB`);
   });
  } catch (error) {
   console.error('[Manager Memory Monitor] Deep analysis failed:', error);
  } finally {
   this.isAnalyzing = false;
  }
 }
}

export default ManagerMemoryMonitor;
