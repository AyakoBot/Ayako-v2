/* eslint-disable no-console */
import * as Discord from 'discord.js';
import baseEventHandler from '../../Events/BotEvents/baseEventHandler.js';
import ready, { setReady } from '../../Events/BotEvents/readyEvents/ready.js';
import type * as Redis from '../Cluster/Redis.js';
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
   client.on(eventName, (...args) => baseEventHandler(eventName, args));
   return;
  }
  client.on(eventName, (...args) => baseEventHandler(eventName, args));
 });

 client.cluster?.on('message', (message) => {
  const m = message as Redis.Message;
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

 events.RestEvents.forEach(async (path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop() as keyof Discord.RestEvents;
  if (!eventName) return;

  client.rest.on(eventName, (...args) => baseEventHandler(eventName, args));
 });
};

if (client.cluster?.maintenance) {
 console.log(`[Cluster ${client.cluster.id + 1}] Cluster spawned in Maintenance-Mode`);

 client.cluster?.on('ready', async () => {
  console.log(`[Cluster ${Number(client.cluster?.id) + 1}] Cluster moved into Ready-State`);
  await spawnEvents();
  setReady();
  ready();
 });
} else {
 await spawnEvents();
 setReady();
 ready();
}
