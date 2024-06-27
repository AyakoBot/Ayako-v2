/* eslint-disable no-console */
import ready, { setReady } from '../../Events/BotEvents/readyEvents/ready.js';
import client from './Client.js';

const spawnEvents = async () =>
 Promise.all(
  ['./Events/Bot.js', './Events/Cluster.js', './Events/Process.js', './Events/Rest.js'].map(
   (p) => import(p),
  ),
 );

if (client.cluster?.maintenance) {
 console.log(`[Cluster ${client.cluster.id + 1}] Cluster spawned in Maintenance-Mode`);

 client.cluster?.on('ready', async () => {
  console.log(`[Cluster ${Number(client.cluster?.id) + 1}] Cluster moved into Ready-State`);
  await spawnEvents();
  setReady();
  ready();
 });
} else {
 await spawnEvents();
 setReady();
 ready();
}
