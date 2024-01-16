import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 const getActivities = (thisShard: number): Discord.ActivitiesOptions => {
  const clusterShardsText = `Cluster ${Number(client.cluster?.id) + 1}/${
   client.util.files.sharding.getInfo().CLUSTER_COUNT
  } | Shard ${thisShard + 1}/${
   client.util.files.sharding.getInfo().SHARD_LIST.length
  } on this Cluster`;

  return {
   name: 'Stable',
   state: `/help | ${clusterShardsText}`,
   type: Discord.ActivityType.Custom,
  };
 };

 client.util.files.sharding.getInfo().SHARD_LIST.forEach((s) => {
  client.user?.setPresence({
   afk: false,
   activities: [getActivities(s)],
   status: Discord.PresenceUpdateStatus.Online,
   shardId: s,
  });
 });
};
