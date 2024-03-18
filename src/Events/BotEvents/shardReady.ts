import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';

export default async (id: number, unavailableGuilds?: Set<string>) => {
 // eslint-disable-next-line no-console
 console.log(`[Shard ${id + 1}] Ready - Unavailable Guilds: ${unavailableGuilds?.size ?? '0'}`);
 client.user?.setPresence({
  afk: false,
  activities: [await getActivities(id)],
  status: Discord.PresenceUpdateStatus.Online,
  shardId: id,
 });
};

const getActivities = async (thisShard: number): Promise<Discord.ActivitiesOptions> => {
 const allShards = (
  await client.cluster?.broadcastEval((cl) => cl.util.files.sharding.getInfo().SHARD_LIST)
 )?.flat();

 const clusterShardsText = `Shard ${thisShard + 1}/${
  Sharding.getInfo().SHARD_LIST.length
 } (Cluster)/${allShards?.length ?? 1} (Total) | Cluster ${Number(client.cluster?.id) + 1}/${
  Sharding.getInfo().CLUSTER_COUNT
 }`;

 return {
  name: 'Stable',
  state: `/help | ${clusterShardsText}`,
  type: Discord.ActivityType.Custom,
 };
};
