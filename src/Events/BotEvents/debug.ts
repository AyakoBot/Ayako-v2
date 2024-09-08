import { metricsCollector } from '../../BaseClient/Bot/Metrics.js';
import DataBase from '../../BaseClient/Bot/DataBase.js';

export default (message: string) => {
 if (process.argv.includes('--debug')) {
 // eslint-disable-next-line no-console
  console.log(message);
  return;
 }

 if (message.includes('Heartbeat')) {
  const shard = message.split(']')[0].split(/\s+/g).at(-1) ?? '';
  const ms = message.split(' ').at(-1)?.replace(/\D/g, '') ?? '';

  DataBase.heartbeats
   .upsert({
    where: { shard },
    create: { shard, ms, timestamp: Date.now() },
    update: { ms, timestamp: Date.now() },
   })
   .then();

  metricsCollector.shardLatency('Ayako - Manager', Number(shard), Number(ms));
 }

};
