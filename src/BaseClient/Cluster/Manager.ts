/* eslint-disable no-console */
import * as Sharding from 'discord-hybrid-sharding';
import 'dotenv/config';
import readline from 'readline';

const Manager = new Sharding.ClusterManager(`./dist/bot.js`, {
 totalShards: 'auto',
 totalClusters: 'auto',
 shardsPerClusters: 10,
 token: (process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '',
 shardArgs: process.argv,
 execArgv: [
  '--experimental-json-modules',
  '--experimental-wasm-modules',
  ...(process.argv.includes('--dev') ? [] : ['--no-deprecation', '--no-warnings']),
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
  console.log(
   `[Cluster Manager] Startup Failed. Retry after: ${
    Number(e.headers?.get('retry-after') ?? 0) / 60
   } Minutes`,
  );
  process.exit(1);
 });

export default Manager;

// @ts-ignore
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 console.log('[Cluster Manager] Restarting all Clusters...');
 await Manager.recluster?.start({ restartMode: 'rolling' });
});
