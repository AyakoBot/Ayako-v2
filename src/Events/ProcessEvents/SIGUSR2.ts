import memAnalyze from '../../BaseClient/UtilModules/memAnalyze.js';
import client from '../../BaseClient/Bot/Client.js';

export default async () => {
 console.log(`[Process Event] SIGUSR2 received - triggering memory analysis for shard ${client.cluster?.id ?? 'unknown'}`);
 
 try {
  const analysis = await memAnalyze(`cluster${client.cluster?.id ?? 'unknown'}`);
  
  console.log('\n=== On-Demand Memory Analysis ===');
  console.log(`Shard: ${client.cluster?.id ?? 'unknown'}`);
  console.log(`Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log('Top 10 Largest Objects:');
  
  analysis.largestObjects.slice(0, 10).forEach((obj, i) => {
   console.log(`${i + 1}. ${obj.name} (${obj.type}): ${(obj.size / 1024).toFixed(2)}KB`);
  });
  
  console.log('=== Analysis Complete ===\n');
  
 } catch (error) {
  console.error('Memory analysis failed:', error);
 }
};
