import client from '../../../../BaseClient/Bot/Client.js';

type ReturnType = Promise<number[] | undefined>;

export default async () => {
 if (process.argv.includes('--dev')) return;

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
