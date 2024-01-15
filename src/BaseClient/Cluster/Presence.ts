import { DjsDiscordClient, getInfo } from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import pack from '../../../package.json' assert { type: 'json' };
import splitByThousand from '../UtilModules/splitByThousands.js';
import Manager from './Manager.js';

let iteration = 0;

scheduleJob('0 * * * * *', async () => {
 iteration += 1;

 const [guildCount, userCount] = await Promise.all(
  [
   'guilds.cache.size',
   (c: DjsDiscordClient) => c.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
  ]
   .map((v) => (typeof v !== 'string' ? Manager.broadcastEval(v) : Manager.fetchClientValues(v)))
   .map(async (v) => ((await v) as number[] | undefined)?.reduce((a, c) => a + c, 0) ?? 0),
 );

 Manager.broadcastEval(
  (cl, { guilds, users, i, clusters }) => {
   const getActivities = (): Discord.ActivitiesOptions => {
    switch (i % 3) {
     case 1:
      return {
       name: `${splitByThousand(guilds)} Servers | v${
        pack.version
       } | Default Prefix: h! and / | Cluster ${cl.cluster?.id}/${clusters}`,
       type: Discord.ActivityType.Watching,
      };
     case 2:
      return {
       name: `with ${splitByThousand(users)} Users | v${
        pack.version
       } | Default Prefix: h! and / | Cluster ${cl.cluster?.id}/${clusters}`,
       type: Discord.ActivityType.Playing,
      };
     default:
      return {
       name: 'Stable',
       state: `Default Prefix: h! and / | v${pack.version} | Cluster ${cl.cluster?.id}/${clusters}`,
       type: Discord.ActivityType.Custom,
      };
    }
   };

   cl.user?.setPresence({
    afk: false,
    activities: [getActivities()],
    status: Discord.PresenceUpdateStatus.Online,
    shardId: cl.cluster?.id,
   });
  },
  {
   context: {
    guilds: guildCount,
    users: userCount,
    i: iteration,
    clusters: getInfo().CLUSTER_COUNT,
    shards: getInfo().TOTAL_SHARDS,
   },
  },
 );
});
