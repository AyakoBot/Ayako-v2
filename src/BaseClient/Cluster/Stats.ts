import { DjsDiscordClient } from 'discord-hybrid-sharding';
import { scheduleJob } from 'node-schedule';
import pack from '../../../package.json' assert { type: 'json' };
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
  (
   cl: DjsDiscordClient,
   { guilds, users, packVer }: { guilds: number; users: number; packVer: string },
  ) => {
   cl.application?.edit({
    description: `\`${cl.util.splitByThousand(guilds)} Servers\` | \`${cl.util.splitByThousand(
     users,
    )} Users\` | \`v${packVer}\`
**Your go-to, free-to-access, management, and automation Discord Bot!**

https://ayakobot.com
https://support.ayakobot.com`,
   });
  },
  { context: { guilds: guildCount, users: userCount, packVer: pack.version }, cluster: 0 },
 );
});
