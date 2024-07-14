import { DjsDiscordClient } from 'discord-hybrid-sharding';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../UtilModules/getPathFromError.js';
import Manager from './Manager.js';
import { glob } from 'glob';

scheduleJob(getPathFromError(new Error()), '0 */10 * * * *', async () => {
 const [guildCount, userCount] = await Promise.all(
  [
   'guilds?.cache.size',
   (c: DjsDiscordClient) => c.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
  ]
   .map((v) => (typeof v !== 'string' ? Manager.broadcastEval(v) : Manager.fetchClientValues(v)))
   .map(async (v) => ((await v) as number[] | undefined)?.reduce((a, c) => a + c, 0) ?? 0),
 );

 Manager.broadcastEval(
  (cl: DjsDiscordClient, { guilds, users }: { guilds: number; users: number }) => {
   cl.util.request.applications.editCurrent(undefined, {
    description: `\`${cl.util.splitByThousand(guilds)} Servers\` | \`${cl.util.splitByThousand(
     users,
    )} Users\` | \`v${cl.util.files.importCache.package.file.version}\`
**Your go-to, free-to-access, management, and automation Discord Bot!**

https://ayakobot.com
https://support.ayakobot.com`,
   });
  },
  {
   context: { guilds: guildCount, users: userCount },
   cluster: 0,
  },
 );
});

const getAllUsers = async () =>
 (
  (await Manager.broadcastEval((c) =>
   c.guilds?.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
  )) ?? [0]
 )?.reduce((acc, guildCount) => acc + guildCount, 0) ?? null;

const getAllGuilds = async () =>
 ((await Manager.broadcastEval((c) => c.guilds?.cache.size)) ?? [0])?.reduce(
  (acc, guildCount) => acc + guildCount,
  0,
 ) ?? null;

const run = () => {
 if (Buffer.from(Manager.token!.split('.')[0], 'base64').toString() !== process.env.mainId) return;

 scheduleJob(getPathFromError(new Error()), '0 0 */1 * * *', async () => {
  const [users, guilds] = await Promise.all([getAllUsers(), getAllGuilds()]);
  console.log(`| Stats: ${users} Users, ${guilds} Guilds, ${Manager.totalShards} Shards`);

  glob.sync('./Stats/*.js').forEach((f) => import(f).then((r) => r.default(guilds, users)));
 });
};

run();
