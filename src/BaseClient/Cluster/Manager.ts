/* eslint-disable no-console */
import * as Sharding from 'discord-hybrid-sharding';
import 'dotenv/config';
import fs from 'fs';

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

let missedHearbeats = 0;
setInterval(async () => {
 const lastAlive = fs.readFileSync('/app/Ayako/alive.txt', 'utf-8');
 console.log('Heartbeat check:', lastAlive, Date.now());

 if (Date.now() - Number(lastAlive) > 120000) {
  missedHearbeats++;
  console.warn(
   `CRITICAL: No heartbeat received from clusters for ${(Date.now() - Number(lastAlive)) / 1000} seconds (missed heartbeats: ${missedHearbeats})`,
  );
 } else {
  missedHearbeats = 0;
  console.log('Heartbeat received from clusters');
 }

 if (missedHearbeats >= 3) {
  console.error('PANIC: No heartbeats received from clusters, forcing restart');
  process.exit(1);
 }
}, 60000);
