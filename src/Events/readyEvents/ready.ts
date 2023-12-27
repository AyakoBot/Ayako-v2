import * as Jobs from 'node-schedule';
import client from '../../BaseClient/Client.js';
import log from '../../BaseClient/ClientHelperModules/logError.js';

import startupTasks from './startupTasks.js';

let ready = true;

export default async () => {
 ready = true;

 log(
  `| Logged in
| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${client.user?.id}
| Login at ${new Date(Date.now()).toLocaleString()}
| => Shard: ${client.guilds.cache.first()?.shardId}`,
  true,
 );

 Jobs.scheduleJob('*/10 * * * *', async () => {
  log(`=> Current Date: ${new Date().toLocaleString()}`, true);
 });

 startupTasks();
};

export const getReady = () => ready;
