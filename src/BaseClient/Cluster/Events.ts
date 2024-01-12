import Manager from './Manager.js';
import log from '../UtilModules/logError.js';

process.setMaxListeners(5);

process.on('unhandledRejection', async (error: string) => log(error, true));
process.on('uncaughtException', async (error: string) => log(error, true));
process.on('promiseRejectionHandledWarning', (error: string) => log(error, true));
process.on('experimentalWarning', (error: string) => log(error, true));

process.on('SIGINT', () => {
 Manager.broadcastEval((cl) => cl.emit('SIGINT'));
 log('[SIGINT]: Gracefully shutting down...', true);
 process.exit(0);
});

Manager.on('clusterCreate', (cluster) => {
 log(`[Cluster Manager] Launched Cluster ${cluster.id}`, true);

 cluster.setMaxListeners(4);

 cluster.on('ready', () => log(`[Cluster Manager] Cluster ${cluster.id} is ready`, true));
 cluster.on('death', (cl) => log(`[Cluster Manager] Cluster ${cl.id} has died`, true));
 cluster.on('error', (err) =>
  log(
   `[Cluster Manager] Cluster ${cluster.id} has encountered an error\n> ${err.message}\n${err.stack}`,
   true,
  ),
 );
});

if (process.argv.includes('--debug')) {
 Manager.on('debug', (debug) => log(`[Cluster Manager] Debug Message: ${debug}`));
}
