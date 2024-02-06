import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import 'dotenv/config';
import readline from 'readline';
import * as AutoPoster from 'topgg-autoposter';
import log from '../UtilModules/logError.js';

const Manager = new Sharding.ClusterManager(`./dist/bot.js`, {
 totalShards: 'auto',
 totalClusters: 'auto',
 shardsPerClusters: 10,
 token: process.env.Token,
 shardArgs: process.argv,
 execArgv: [
  '--experimental-wasm-modules',
  '--no-deprecation',
  '--no-warnings',
  '--heapsnapshot-near-heap-limit=1',
 ],
 respawn: true,
 mode: 'process',
});

Manager.extend(new Sharding.ReClusterManager({ restartMode: 'rolling' }));

await Manager.spawn()
 .then(() => {
  setInterval(async () => {
   await Manager.broadcastEval(`this.ws.status && this.isReady() ? this.ws.reconnect() : 0`);
  }, 60000);
 })
 .catch((e) => {
  log(e, true);

  log(
   `[Cluster Manager] Startup Failed. Retry after: ${
    Number(e.headers?.get('retry-after') ?? 0) / 60
   } Minutes`,
   true,
  );
  process.exit(1);
 });

export default Manager;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 log('[Cluster Manager] Restarting all Clusters...', true);
 await Manager.recluster?.start({ restartMode: 'rolling' });
});

if (
 Buffer.from(process.env.Token?.replace('Bot ', '').split('.')[0] ?? '0', 'base64').toString() ===
 process.env.mainID
) {
 new AutoPoster.DJSSharderPoster(
  process.env.topGGToken ?? '',
  new Discord.ShardingManager(`./dist/bot.js`, {
   totalShards: Manager.totalShards,
   shardList: Manager.shardList,
   mode: Manager.mode,
   respawn: Manager.respawn,
   shardArgs: Manager.shardArgs,
   execArgv: Manager.execArgv,
  }),
  { startPosting: true },
 );
}
