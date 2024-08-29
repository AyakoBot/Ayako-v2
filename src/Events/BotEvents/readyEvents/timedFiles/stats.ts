import { metricsCollector } from 'src/BaseClient/Bot/Metrics.js';
import client from '../../../../BaseClient/Bot/Client.js';

type ReturnType = Promise<number[] | undefined>;

let run = 0;

export default async () => {
 run += 1;
 if (process.argv.includes('--dev')) return;
 if (run % 30 !== 0) return;

 const [emoteCount, userCount, allUsers, roleCount, channelCount, guildCount, stickerCount] = (
  await Promise.all([
   client.cluster?.fetchClientValues('emojis?.cache.size') as ReturnType,
   client.cluster?.fetchClientValues('users?.cache.size') as ReturnType,
   client.cluster?.broadcastEval((c) =>
    c.guilds?.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
   ) as ReturnType,
   client.cluster?.broadcastEval((c) =>
    c.guilds?.cache.reduce((acc, guild) => acc + guild.roles?.cache.size, 0),
   ) as ReturnType,
   client.cluster?.broadcastEval((c) =>
    c.guilds?.cache.reduce((acc, guild) => acc + guild.channels?.cache.size, 0),
   ) as ReturnType,
   client.cluster?.fetchClientValues('guilds?.cache.size') as ReturnType,
   client.cluster?.broadcastEval((c) =>
    c.guilds?.cache.reduce((acc, guild) => acc + guild.stickers?.cache.size, 0),
   ) as ReturnType,
  ])
 ).map((v) => (v ?? []).reduce((acc, count) => acc + count, 0));

 const shardList = await client.cluster?.broadcastEval(
  (cl) => cl.util.files.sharding.getInfo().SHARD_LIST,
 );

 metricsCollector.guildCount(guildCount);
 metricsCollector.userCount(allUsers);
 metricsCollector.emojiCount(emoteCount);
 metricsCollector.roleCount(allUsers);
 metricsCollector.channelCount(channelCount);
 metricsCollector.stickerCount(stickerCount);
 metricsCollector.clusterCount(client.util.files.sharding.getInfo().CLUSTER_COUNT ?? 1);
 metricsCollector.shardCount((shardList?.flat() ?? [1]).reduce((v, v2) => v2 + v, 0));

 client.util.DataBase.stats
  .create({
   data: {
    userCount,
    guildCount,
    channelCount,
    roleCount,
    allUsers,
    emoteCount,
    stickerCount,
    clusterCount: client.util.files.sharding.getInfo().CLUSTER_COUNT ?? 1,
    shardCount: (shardList?.flat() ?? [1]).reduce((v, v2) => v2 + v, 0),
    timestamp: Date.now(),
   },
  })
  .then();
};
