import { getInfo } from 'discord-hybrid-sharding';
import client from '../../../BaseClient/Bot/Client.js';
import log from '../../../BaseClient/UtilModules/logError.js';

import startupTasks from './startupTasks.js';

let ready = !process.argv.includes('--debug');

export default async () => {
 if (ready) return;
 ready = true;

 log(
  `| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${client.user?.id}
| => Cluster: ${Number(client.cluster?.id) + 1}
| => Shards: ${getInfo()
   .SHARD_LIST.map((s) => s + 1)
   .join(', ')}
| Login at ${new Date(Date.now()).toLocaleString()}`,
  true,
 );

 startupTasks();
};

export const getReady = () => ready;
