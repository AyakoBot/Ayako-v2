/* eslint-disable no-console */
import * as Discord from 'discord.js';
import baseEventHandler from '../../Events/BotEvents/baseEventHandler.js';
import type * as Socket from '../Cluster/Socket.js';
import { ProcessEvents } from '../UtilModules/getEvents.js';
import client from './Client.js';

const spawnEvents = async () => {
 const util = await import('../UtilModules/getEvents.js');
 const events = util.default;

 client.setMaxListeners(events.BotEvents.length);

 events.BotEvents.forEach(async (path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop() as keyof Discord.ClientEvents;
  if (!eventName) return;

  if (eventName === 'ready' && !client.cluster?.maintenance) {
   client.once(eventName, (...args) => baseEventHandler(eventName, args));
   return;
  }
  client.on(eventName, (...args) => baseEventHandler(eventName, args));
 });

 client.cluster?.on('message', (message) => {
  const m = message as Socket.SocketMessage;
  if (typeof m !== 'object') return;
  if (!('type' in m)) return;

  const eventName = m.type;
  if (!eventName) return;

  baseEventHandler(eventName, [message]);
 });

 events.ProcessEvents.forEach(async (path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop() as ProcessEvents;
  if (!eventName) return;

  process.on(eventName, (...args) => baseEventHandler(eventName, args));
 });
};

if (client.cluster?.maintenance) {
 console.log(`[Cluster ${client.cluster.id}] Cluster spawned in Maintenance-Mode`);

 client.cluster?.on('ready', async () => {
  console.log(`[Cluster ${client.cluster?.id}] Cluster moved into Ready-State`);
  spawnEvents();
  baseEventHandler('ready', []);
 });
} else spawnEvents();

client.rest.on('rateLimited', (info) => {
 const str = `[Ratelimited] ${info.method} ${info.url.replace(
  'https://discord.com/api/v10/',
  '',
 )} ${info.timeToReset}ms`;

 if (process.argv.includes('--debug')) console.log(str);
 client.util.logFiles.ratelimits.write(`${str}\n`);
});
