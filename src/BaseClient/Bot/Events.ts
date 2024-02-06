/* eslint-disable no-console */
import * as Discord from 'discord.js';
import baseEventHandler from '../../Events/BotEvents/baseEventHandler.js';
import type * as Socket from '../Cluster/Socket.js';
import events from '../UtilModules/getEvents.js';
import type { ProcessEvents } from '../UtilModules/getEvents.js';
import client from './Client.js';

const spawnEvents = async () => {
 client.setMaxListeners(events.BotEvents.length);

 events.BotEvents.forEach((path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop() as keyof Discord.ClientEvents;
  if (!eventName) return;

  if (eventName === 'ready' && !client.cluster?.maintenance) {
   client.on('ready', (...args) => {
    if (client.cluster?.maintenance) return;
    baseEventHandler(eventName, args);
   });

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

 client.cluster?.on('ready', (cl) => {
  import('../UtilModules/importCache/BaseClient/Bot.js').then((e) =>
   e.default.Presence.file.default(cl),
  );
 });

 // eslint-disable-next-line import/no-named-as-default-member
 events.ProcessEvents.forEach((path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop() as ProcessEvents;
  if (!eventName) return;

  process.on(eventName, (...args) => baseEventHandler(eventName, args));
 });
};

if (client.cluster?.maintenance) {
 console.log(`[Cluster ${client.cluster.id}] Cluster spawned in Maintenance-Mode`);

 client.cluster?.on('ready', () => {
  console.log(`[Cluster ${Number(client.cluster?.id) + 1}] Cluster moved into Ready-State`);
  spawnEvents();
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
