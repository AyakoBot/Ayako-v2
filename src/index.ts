/* eslint-disable no-console */
import * as Jobs from 'node-schedule';
import sms from 'source-map-support';
import './BaseClient/UtilModules/console.js';
import getPathFromError from './BaseClient/UtilModules/getPathFromError.js';

console.clear();
console.log('+++++++++++++++ Welcome to Ayako ++++++++++++++++');
console.log('+      Restart all Clusters with "restart"      +');
console.log('+                  Arguments:                   +');
console.log('+   --debug --debug-db --warn --debug-queries   +');
console.log('+                --silent --dev                 +');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++');

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

(async () => {
 [
  './BaseClient/Cluster/Manager.js',
  './BaseClient/Cluster/Redis.js',
  './BaseClient/Cluster/Events.js',
  './BaseClient/Cluster/Stats.js',
 ].forEach((f) => import(f));
})();

Jobs.scheduleJob(getPathFromError(new Error()), '*/10 * * * *', async () => {
 console.log(`=> Current Date: ${new Date().toLocaleString()}`);
});
