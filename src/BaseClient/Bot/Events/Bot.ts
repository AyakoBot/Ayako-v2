import * as Discord from 'discord.js';
import baseEventHandler from '../../../Events/BotEvents/baseEventHandler.js';
import events from '../../UtilModules/getEvents.js';
import client from '../Client.js';

//@ts-ignore
client.setMaxListeners(events.BotEvents.length);

events.BotEvents.forEach((path: string) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop() as keyof Discord.ClientEvents;
 if (!eventName) return;

 client.on(eventName, (...args) => baseEventHandler(eventName, args));
});
