/* eslint-disable no-console */
import * as Sharding from 'discord-hybrid-sharding';
import 'dotenv/config';
import ManagerMemoryMonitor from './ManagerMemoryMonitor.js';

const Manager = new Sharding.ClusterManager(`./dist/bot.js`, {
 totalShards: 'auto',
 totalClusters: 'auto',
 shardsPerClusters: 10,
 token: (process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '',
 shardArgs: process.argv,
 execArgv: [
  '--experimental-json-modules',
  '--experimental-wasm-modules',
  '--expose-gc',
  '--max-old-space-size=8192',
  ...(process.argv.includes('--dev') ? [] : ['--no-deprecation', '--no-warnings']),
 ],
 respawn: true,
 mode: 'process',
});

await Manager.spawn()
 .then(() => {
  setInterval(async () => {
   await Manager.broadcastEval(`this.ws.status && this.isReady() ? this.ws.reconnect() : 0`);
  }, 60000);

  ManagerMemoryMonitor.initialize();
 })
 .catch((e: Response) => {
  console.log(
   `[Cluster Manager] Startup Failed. Retry after: ${
    Number(e.headers?.get('retry-after') ?? 0) / 60
   } Minutes`,
  );
  console.error(e);
  process.exit(1);
 });

export default Manager;
