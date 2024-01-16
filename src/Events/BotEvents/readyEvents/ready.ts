import client from '../../../BaseClient/Bot/Client.js';
import log from '../../../BaseClient/UtilModules/logError.js';

import startupTasks from './startupTasks.js';
import presence from './startupTasks/presence.js';

let ready = !process.argv.includes('--debug');
let wasReadyBefore = false;

export default async () => {
 presence();
 if (wasReadyBefore) return;

 ready = true;
 wasReadyBefore = true;

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
