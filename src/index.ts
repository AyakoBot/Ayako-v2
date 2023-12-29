/* eslint-disable no-console */
import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import DotENV from 'dotenv';
import readline from 'readline';
import { AutoPoster } from 'topgg-autoposter';
import sms from 'source-map-support';
import log from './BaseClient/ClientHelperModules/logError.js';

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
+   Restart one Shard with "restart [Shard ID]" +
+                   Arguments:                  +
+   --debug --debug-db --warn --debug-queries   +
+                   --silent                    +
+++++++++++++++++++++++++++++++++++++++++++++++++`,
 true,
);

const manager = new Discord.ShardingManager(
 `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/bot.js`,
 {
  token: process.env.Token,
  shardArgs: process.argv,
  execArgv: ['--experimental-wasm-modules'],
 },
);

manager.on('shardCreate', (shard) => {
 log(`[Shard Manager] Launched Shard ${shard.id}`, true);
 shard.on('ready', () => log(`[Shard Manager] Shard ${shard.id} is ready`, true));
});

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
  `[Shard Manager] Startup Failed. Retry after: ${e.headers.get('retry-after') / 60} Minutes`,
 );
 process.exit(1);
});

AutoPoster(process.env.topGGToken ?? '', manager).start();

Jobs.scheduleJob('*/10 * * * *', async () => {
 log(`=> Current Date: ${new Date().toLocaleString()}`, true);
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 const shardID = code.split(/\s+/)[1];
 if (!shardID) manager.respawnAll({ respawnDelay: 1000 });
 else manager.shards.get(Number(shardID))?.respawn({ delay: 1000 });
});
