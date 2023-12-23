import readline from 'readline';
import sms from 'source-map-support';
/* eslint-disable no-console */
import * as Discord from 'discord.js';

import auth from './auth.json' assert { type: 'json' };

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

// eslint-disable-next-line no-console
const { log } = console;

console.clear();
log(`
+++++++++++++++ Welcome to Ayako ++++++++++++++++
+       Restart all Shards with "restart"       +
+   Restart one Shard with "restart [Shard ID]" +
+                   Arguments:                  +
+  "--debug --debug-db --warn --debug-queries"  +
+++++++++++++++++++++++++++++++++++++++++++++++++
`);

const manager = new Discord.ShardingManager(
 `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/bot.js`,
 {
  token: auth.token,
  shardArgs: process.argv,
  execArgv: ['--experimental-wasm-modules', '--experimental-websocket'],
 },
);

manager.on('shardCreate', (shard) => log(`[Shard Manager] Launched Shard ${shard.id}`));

process.setMaxListeners(5);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));
process.on('SIGINT', () => {
 manager.broadcastEval((cl) => cl.emit('SIGINT'));
 log('[SIGINT]: Gracefully shutting down...');
 process.exit(0);
});

await manager.spawn();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 const shardID = code.split(/\s+/)[1];
 if (!shardID) manager.respawnAll({ respawnDelay: 1000 });
 else manager.shards.get(Number(shardID))?.respawn({ delay: 1000 });
});
