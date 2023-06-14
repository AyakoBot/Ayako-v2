import * as Jobs from 'node-schedule';
import client from '../../BaseClient/Client.js';

import startupTasks from './startupTasks.js';

const { log } = console;

export default async () => {
 log(
  `| Logged in\n| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${
   client.user?.id
  }\n| Login at ${new Date(Date.now()).toLocaleString()}`,
 );

 Jobs.scheduleJob('*/10 * * * *', async () => {
  log(`=> Current Date: ${new Date().toLocaleString()}`);
 });

 startupTasks();
};
