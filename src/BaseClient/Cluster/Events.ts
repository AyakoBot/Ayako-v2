/* eslint-disable no-console */
import Manager from './Manager.js';
import warning from '../../Events/ProcessEvents/warning.js';
import redis from './Redis.js';

process.setMaxListeners(5);

process.on('unhandledRejection', async (error: string) => console.log(error));
process.on('uncaughtException', async (error: string) => console.log(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.log(error));
process.on('experimentalWarning', (error: string) => console.log(error));

process.on('SIGINT', async () => {
 Manager.broadcastEval((cl) => cl.emit('SIGINT'));
 console.log('[SIGINT]: Gracefully shutting down...');

 redis.disconnect();
 process.exit(0);
});

Manager.on('clusterCreate', (cluster) => {
 console.log(`[Cluster Manager] Launched Cluster ${cluster.id + 1}`);

 cluster.setMaxListeners(4);

 cluster.on('ready', () =>
  console.log(`[Cluster Manager] Cluster ${cluster.id + 1} has moved into Ready-State`),
 );
 cluster.on('death', () => console.log(`[Cluster Manager] Cluster ${cluster.id + 1} has died`));
 cluster.on('error', (err) =>
  console.log(
   `[Cluster Manager] Cluster ${cluster.id + 1} has encountered an error\n> ${err.message}\n${
    err.stack
   }`,
   true,
  ),
 );
});

if (process.argv.includes('--debug')) {
 Manager.on('debug', (debug) => console.log(`[Cluster Manager] Debug Message: ${debug}`));
}

process.on('warning', warning);
