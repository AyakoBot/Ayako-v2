import * as Discord from 'discord.js';
import pack from '../../../../../package.json' assert { type: 'json' };
import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 const random = Math.floor(Math.random() * 3);

 const activities: Discord.ActivitiesOptions[] = [];

 const [guildSize, userSize] = await Promise.all([
  client.cluster?.fetchClientValues('guilds.cache.size'),
  client.cluster?.broadcastEval((c) =>
   c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
  ),
 ]);

 const totalusers = (userSize as number[] | undefined)?.reduce((acc, count) => acc + count, 0) ?? 0;
 const totalguildcount =
  (guildSize as number[] | undefined)?.reduce((acc, count) => acc + count, 0) ?? 0;

 switch (random) {
  case 1: {
   activities.push({
    name: `${client.util.splitByThousand(totalguildcount)} Servers | v${
     pack.version
    } | Default Prefix: ${client.util.constants.standard.prefix}`,
    type: Discord.ActivityType.Competing,
   });
   break;
  }
  case 2: {
   activities.push({
    name: `with ${client.util.splitByThousand(totalusers)} Users | v${pack.version} | ${
     client.util.constants.standard.prefix
    }invite`,
    type: Discord.ActivityType.Playing,
   });
   break;
  }
  default: {
   activities.push({
    name: 'Stable',
    state: `Stable | v${pack.version} | Default Prefix: ${client.util.constants.standard.prefix} | Shard ${client.cluster?.id}}/${client.cluster?.ids.length}`,
    type: Discord.ActivityType.Custom,
   });
   break;
  }
 }

 client.user?.setPresence({
  afk: false,
  activities,
  status: Discord.PresenceUpdateStatus.Online,
  shardId: client.cluster?.id,
 });
};
