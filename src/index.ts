import sms from 'source-map-support';
import * as Jobs from 'node-schedule';
import log from './BaseClient/UtilModules/logError.js';

// eslint-disable-next-line no-console
console.clear();
log(
 `+++++++++++++++ Welcome to Ayako ++++++++++++++++
+      Restart all Clusters with "restart"      +
+                  Arguments:                   +
+   --debug --debug-db --warn --debug-queries   +
+                   --silent                    +
+++++++++++++++++++++++++++++++++++++++++++++++++`,
 true,
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
  './BaseClient/Cluster/Presence.js',
 ].forEach((f) => import(f));
})();

Jobs.scheduleJob('*/10 * * * *', async () => {
 log(`=> Current Date: ${new Date().toLocaleString()}`, true);
});
