import client from '../../BaseClient/Client.js';
import log from '../../BaseClient/UtilModules/logError.js';

import startupTasks from './startupTasks.js';

let ready = !process.argv.includes('--debug');

export default async () => {
 ready = true;

 log(
  `| Logged in
| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${client.user?.id}
| Login at ${new Date(Date.now()).toLocaleString()}
| => Shard: ${client.guilds.cache.first()?.shardId}`,
  true,
 );

 startupTasks();
};

export const getReady = () => ready;
