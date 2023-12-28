/* eslint-disable no-console */
import 'dotenv/config';
import sms from 'source-map-support';
import client from './BaseClient/Client.js';
import * as ch from './BaseClient/ClientHelper.js';
// import { getReady } from './Events/readyEvents/ready.js';

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

const events = await ch.getEvents();
client.setMaxListeners(events.length);

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

events.forEach(async (path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop();
 if (!eventName) return;

 const eventHandler = (await import('./Events/baseEventHandler.js')).default;

 if (eventName === 'ready') client.once(eventName, (...args) => eventHandler(eventName, args));
 else client.on(eventName, (...args) => eventHandler(eventName, args));
});

client.rest.on('rateLimited', (info) => {
 const str = `[Ratelimited] ${info.method} ${info.url.replace(
  'https://discord.com/api/v10/',
  '',
 )} ${info.timeToReset}ms`;

 if (processArgs.includes('--debug')) console.log(str);
 ch.logFiles.ratelimits.write(`${str}\n`);
});

// setTimeout(() => {
//  if (client.readyTimestamp && !getReady()) client.shard?.respawnAll();
// }, 5000);
