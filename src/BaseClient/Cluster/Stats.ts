import { DjsDiscordClient } from 'discord-hybrid-sharding';
import { scheduleJob } from 'node-schedule';
import Manager from './Manager.js';

scheduleJob('0 */10 * * * *', async () => {
 const [guildCount, userCount] = await Promise.all(
  [
   'guilds.cache.size',
   (c: DjsDiscordClient) => c.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
  ]
   .map((v) => (typeof v !== 'string' ? Manager.broadcastEval(v) : Manager.fetchClientValues(v)))
   .map(async (v) => ((await v) as number[] | undefined)?.reduce((a, c) => a + c, 0) ?? 0),
 );

 Manager.broadcastEval(
  (cl: DjsDiscordClient, { guilds, users }: { guilds: number; users: number }) => {
   cl.application?.edit({
    description: `\`${cl.util.splitByThousand(guilds)} Servers\` | \`${cl.util.splitByThousand(
     users,
    )} Users\` | \`v${cl.util.files.importCache.package.file.version}\`
**Your go-to, free-to-access, management, and automation Discord Bot!**

https://ayakobot.com
https://support.ayakobot.com`,
   });
  },
  {
   context: {
    guilds: guildCount,
    users: userCount,
   },
   cluster: 0,
  },
 );
});
