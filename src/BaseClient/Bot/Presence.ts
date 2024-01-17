import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import log from '../UtilModules/logError.js';

export default (cluster: Sharding.ClusterClient<Discord.Client<boolean>>) => {
 log(`[Cluster ${Number(cluster?.id) + 1}] Cluster moved into Ready-State`, true);

 const getActivities = (thisShard: number): Discord.ActivitiesOptions => {
  const clusterShardsText = `Cluster ${Number(cluster?.id) + 1}/${
   Sharding.getInfo().CLUSTER_COUNT
  } | Shard ${thisShard + 1}/${Sharding.getInfo().SHARD_LIST.length} on this Cluster`;

  return {
   name: 'Stable',
   state: `/help | ${clusterShardsText}`,
   type: Discord.ActivityType.Custom,
  };
 };

 Sharding.getInfo().SHARD_LIST.forEach((s) => {
  cluster.client.user?.setPresence({
   afk: false,
   activities: [getActivities(s)],
   status: Discord.PresenceUpdateStatus.Online,
   shardId: s,
  });
 });
};
