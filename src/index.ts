import * as Discord from 'discord.js';
import auth from './auth.json' assert { type: 'json' };

const manager = new Discord.ShardingManager('./bot.js', {
  token: auth.token,
});

manager.on('shardCreate', (shard) => console.log(`[Shard Manager] Launched Shard ${shard.id}`));

manager.spawn();
