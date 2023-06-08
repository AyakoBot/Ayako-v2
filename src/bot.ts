/* eslint-disable no-console */
import client from './BaseClient/Client.js';
import * as ch from './BaseClient/ClientHelper.js';

const events = await ch.getEvents();
client.setMaxListeners(events.length);

process.setMaxListeners(4);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));

events.forEach(async (path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop();
 if (!eventName) return;

 const eventHandler = (await import('./Events/baseEventHandler.js')).default;

 if (eventName === 'ready') client.once(eventName, (...args) => eventHandler(eventName, args));
 else client.on(eventName, (...args) => eventHandler(eventName, args));
});

// eslint-disable-next-line no-console
const { log } = console;

client.on('debug', (info) => {
 if (info.includes('Heartbeat')) return;

 log(info);
});

client.on('warn', (info) => {
 log(info);
});
