/* eslint-disable no-console */
import * as Discord from 'discord.js';
import readline from 'readline';
import auth from './auth.json' assert { type: 'json' };

console.clear();
console.log(`
+++++++++++++++ Welcome to Ayako +++++++++++++++
+      Restart all Shards with "restart"       +
+  Restart one Shard with "restart [Shard ID]" +
++++++++++++++++++++++++++++++++++++++++++++++++
`);

const manager = new Discord.ShardingManager('./bot.js', {
 token: auth.token,
});

manager.on('shardCreate', (shard) => console.log(`[Shard Manager] Launched Shard ${shard.id}`));

process.setMaxListeners(4);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));

await manager.spawn();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 const shardID = code.split(/\s+/)[1];
 if (!shardID) manager.respawnAll();
 else manager.shards.get(Number(shardID))?.respawn();
});
