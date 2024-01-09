/* eslint-disable no-console */
import * as Jobs from 'node-schedule';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import DotENV from 'dotenv';
import readline from 'readline';
import * as AutoPoster from 'topgg-autoposter';
import sms from 'source-map-support';
import log from './BaseClient/UtilModules/logError.js';

DotENV.config({ path: `${process.cwd()}${process.cwd().includes('dist') ? '/..' : ''}/.env` });

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

console.clear();
log(
 `+++++++++++++++ Welcome to Ayako ++++++++++++++++
+       Restart all Shards with "restart"       +
+                  Arguments:                   +
+   --debug --debug-db --warn --debug-queries   +
+                   --silent                    +
+++++++++++++++++++++++++++++++++++++++++++++++++`,
 true,
);

const botPath = `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/bot.js`;

const manager = new Sharding.ClusterManager(botPath, {
 totalShards: 'auto',
 totalClusters: 'auto',
 token: process.env.Token,
 shardArgs: process.argv,
 execArgv: ['--experimental-wasm-modules'],
 respawn: true,
 mode: 'process',
});

manager.on('clusterCreate', (cluster) => {
 log(`[Cluster Manager] Launched Shard ${cluster.id}`, true);

 cluster.setMaxListeners(4);

 cluster.on('ready', () => log(`[Cluster Manager] Shard ${cluster.id} is ready`, true));
 cluster.on('death', (cl) => log(`[Cluster Manager] Shard ${cl.id} has died`, true));
 cluster.on('error', (err) =>
  log(
   `[Cluster Manager] Shard ${cluster.id} has encountered an error\n> ${err.message}\n${err.stack}`,
   true,
  ),
 );
});

if (process.argv.includes('--debug')) {
 manager.on('debug', (debug) => {
  log(`[Cluster Manager] Debug Message: ${debug}`);
 });
}

process.setMaxListeners(5);

process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));
process.on('SIGINT', () => {
 manager.broadcastEval((cl) => cl.emit('SIGINT'));
 log('[SIGINT]: Gracefully shutting down...', true);
 process.exit(0);
});

await manager.spawn().catch((e) => {
 console.log(
  `[Cluster Manager] Startup Failed. Retry after: ${e.headers.get('retry-after') / 60} Minutes`,
 );
 process.exit(1);
});

Jobs.scheduleJob('*/10 * * * *', async () => {
 log(`=> Current Date: ${new Date().toLocaleString()}`, true);
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 manager.respawnAll({ respawnDelay: 1000 });
});

if (
 Buffer.from(process.env.Token?.split('.')[0] ?? '0', 'base64').toString() === process.env.mainID
) {
 new AutoPoster.DJSSharderPoster(
  process.env.topGGToken ?? '',
  new Discord.ShardingManager(botPath, {
   totalShards: manager.totalShards,
   shardList: manager.shardList,
   mode: manager.mode,
   respawn: manager.respawn,
   shardArgs: manager.shardArgs,
   execArgv: manager.execArgv,
  }),
  {
   startPosting: true,
  },
 );
}
