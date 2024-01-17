import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import log from '../UtilModules/logError.js';

export default (cluster: Sharding.ClusterClient<Discord.Client<boolean>>) => {
 log(`[Cluster ${Number(cluster?.id) + 1}] Cluster moved into Ready-State`, true);

 const getActivities = async (thisShard: number): Promise<Discord.ActivitiesOptions> => {
  const allShards = (
   await cluster?.broadcastEval((cl) => cl.util.files.sharding.getInfo().SHARD_LIST)
  )?.flat();

  const clusterShardsText = `Shard ${thisShard + 1}/${
   Sharding.getInfo().SHARD_LIST.length
  } (Cluster)/${allShards.length} (Total) | Cluster ${Number(cluster?.id) + 1}/${
   Sharding.getInfo().CLUSTER_COUNT
  }`;

  return {
   name: 'Stable',
   state: `/help | ${clusterShardsText}`,
   type: Discord.ActivityType.Custom,
  };
 };

 Sharding.getInfo().SHARD_LIST.forEach(async (s) => {
  cluster.client.user?.setPresence({
   afk: false,
   activities: [await getActivities(s)],
   status: Discord.PresenceUpdateStatus.Online,
   shardId: s,
  });
 });
};
