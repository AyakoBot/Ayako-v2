/* eslint-disable no-console */
import 'dotenv/config';
import sms from 'source-map-support';
import client from './BaseClient/Client.js';
import ch from './BaseClient/Util.js';

client.util = ch;

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

const processArgs = process.argv;
if (processArgs.includes('--debug')) console.log('[DEBUG] Debug mode enabled');
if (processArgs.includes('--debug-db')) console.log('[DEBUG] Debug mode for database enabled');
if (processArgs.includes('--warn')) console.log('[DEBUG] Warn mode enabled');
if (processArgs.includes('--silent')) console.log('[DEBUG] Silent mode enabled');

process.setMaxListeners(4);
process.on('unhandledRejection', async (error: string) => {
 console.error(error);
 ch.logFiles.console.write(`${error}\n`);
});
process.on('uncaughtException', async (error: string) => {
 console.error(error);
 ch.logFiles.console.write(`${error}\n`);
});
process.on('promiseRejectionHandledWarning', (error: string) => {
 console.error(error);
 ch.logFiles.console.write(`${error}\n`);
});
process.on('experimentalWarning', (error: string) => {
 console.error(error);
 ch.logFiles.console.write(`${error}\n`);
});

client.rest.on('rateLimited', (info) => {
 const str = `[Ratelimited] ${info.method} ${info.url.replace(
  'https://discord.com/api/v10/',
  '',
 )} ${info.timeToReset}ms`;

 if (processArgs.includes('--debug')) console.log(str);
 ch.logFiles.ratelimits.write(`${str}\n`);
});

console.log(client.cluster?.maintenance);

const spawnEvents = async () => {
 const eventHandler = (await import('./Events/baseEventHandler.js')).default;
 const events = await ch.getEvents();
 client.setMaxListeners(events.length);

 events.forEach(async (path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop();
  if (!eventName) return;

  if (eventName === 'ready' && !client.cluster?.maintenance) {
   client.once(eventName, (...args) => eventHandler(eventName, args));
   return;
  }
  client.on(eventName, (...args) => eventHandler(eventName, args));
 });
};

if (client.cluster?.maintenance) {
 console.log(`[Cluster ${client.cluster.id}] Cluster spawned in Maintenance-Mode`);

 client.cluster?.on('ready', async () => {
  console.log(`[Cluster ${client.cluster?.id}] Cluster moved into Ready-State`);
  const eventHandler = (await import('./Events/baseEventHandler.js')).default;
  spawnEvents();
  eventHandler('ready', []);
 });
} else spawnEvents();
