import * as Discord from 'discord.js';
import auth from './auth.json' assert { type: 'json' };

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
