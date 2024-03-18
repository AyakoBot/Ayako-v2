/* eslint-disable no-console */
import * as Jobs from 'node-schedule';
import sms from 'source-map-support';
import './BaseClient/UtilModules/console.js';

console.clear();
console.log(
 `+++++++++++++++ Welcome to Ayako ++++++++++++++++
+      Restart all Clusters with "restart"      +
+                  Arguments:                   +
+   --debug --debug-db --warn --debug-queries   +
+                   --silent                    +
+++++++++++++++++++++++++++++++++++++++++++++++++`,
);

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

(async () => {
 [
  './BaseClient/Cluster/Manager.js',
  './BaseClient/Cluster/Socket.js',
  './BaseClient/Cluster/Events.js',
  './BaseClient/Cluster/Stats.js',
 ].forEach((f) => import(f));
})();

Jobs.scheduleJob('*/10 * * * *', async () => {
 console.log(`=> Current Date: ${new Date().toLocaleString()}`);
});
