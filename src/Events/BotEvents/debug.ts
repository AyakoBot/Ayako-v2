import { metricsCollector } from '../../BaseClient/Bot/Metrics.js';
import DataBase from '../../BaseClient/Bot/DataBase.js';

export default (message: string) => {
 if (message.includes('Heartbeat')) {
  const shard = message.split(']')[0].split(/\s+/g).at(-1) ?? '';
  const ms = message.split(' ').at(-1)?.replace(/\D/g, '') ?? '';

  DataBase.heartbeats
   .create({
    data: { shard, ms, timestamp: Date.now() },
   })
   .then();

   metricsCollector.shardLatency('Ayako - Manager', Number(shard), Number(ms));

  if (!process.argv.includes('--debug')) return;
 }

 // eslint-disable-next-line no-console
 console.log(message);
};
