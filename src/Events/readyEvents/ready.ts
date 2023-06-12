import * as Jobs from 'node-schedule';
import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';

import startupTasks from './startupTasks.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async () => {
 await ch.DataBase.redis.flushAll();

 log(
  `| Logged in\n| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${
   client.user?.id
  }\n| Login at ${new Date(Date.now()).toLocaleString()}\n| Redis DB Flushed`,
 );

 Jobs.scheduleJob('*/10 * * * *', async () => {
  log(`=> Current Date: ${new Date().toLocaleString()}`);
 });

 startupTasks();
};
