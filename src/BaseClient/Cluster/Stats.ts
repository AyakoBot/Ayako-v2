import { type DjsDiscordClient } from 'discord-hybrid-sharding';
import { glob } from 'glob';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../UtilModules/getPathFromError.js';
import Manager from './Manager.js';

scheduleJob(getPathFromError(new Error()), '0 */10 * * * *', async () => {
 const guildCount = await Manager.fetchClientValues('guilds?.cache.size');

 Manager.broadcastEval(
  async (cl: DjsDiscordClient, { guilds }: { guilds: number }) => {
   const app = await cl.util.request.applications
    .getCurrent(undefined)
    .then((r) => ('message' in r ? undefined : r));

   cl.util.request.applications.editCurrent(undefined, {
    description: `Helping \`${cl.util.splitByThousand(guilds)} Servers\` / \`${cl.util.splitByThousand(app?.approximate_user_install_count ?? 0)} Users\` 
Current Version: \`v${cl.util.files.importCache.package.file.version}\`
**Your go-to, free-to-access, management, and automation Discord Bot!**

https://ayakobot.com
https://support.ayakobot.com`,
   });
  },
  { context: { guilds: guildCount }, cluster: 0 },
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
  // eslint-disable-next-line no-console
  console.log(`| Stats: ${users} Users, ${guilds} Guilds, ${Manager.totalShards} Shards`);

  (
   await glob(
    `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/BaseClient/Cluster/Stats/**/*`,
   )
  )
   .filter((f) => f.endsWith('.js'))
   .forEach(async (f) => {
    // eslint-disable-next-line no-console
    console.log('Running stats', f);

    const file = await import(f);

    file.default(guilds, users);
   });
 });
};

run();
