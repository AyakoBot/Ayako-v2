import Jobs from 'node-schedule';
import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';

// import willis from './startupTasks/willis.js';

export default async () => {
 // Jobs.scheduleJob('0 13 15 * *', () => {
 //  willis();
 // });

 (await import('./startupTasks/voteHandler.js')).default();
 (await import('./startupTasks/appealHandler.js')).default();

 if (ch.mainID !== client.user?.id) return;

 (await import('./antivirusBlocklistCacher')).default();
 Jobs.scheduleJob('*/30 * * * *', async () => {
  (await import('./antivirusBlocklistCacher')).default();
 });

 Jobs.scheduleJob('*/1 */1 */1 * *', async () => {
  if (client.user?.id === ch.mainID) (await import('./websiteFetcher.js')).default();
 });

 Jobs.scheduleJob('*/1 * * * *', async () => {
  (await import('./timedFiles/presence.js')).default();
  (await import('./verification.js')).default();
 });

 Jobs.scheduleJob('*/2 * * * * *', async () => {
  (await import('./timedFiles/timedManager.js')).default();
 });

 (await import('./startupTasks/slashCommands.js')).default();
 (await import('./startupTasks/cache.js')).default();
};
