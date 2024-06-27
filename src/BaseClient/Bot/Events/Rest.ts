import * as Discord from 'discord.js';
import baseEventHandler from '../../../Events/BotEvents/baseEventHandler.js';
import events from '../../UtilModules/getEvents.js';
import client from '../Client.js';

events.RestEvents.forEach((path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop() as keyof Discord.RestEvents;
 if (!eventName) return;

 client.rest.on(eventName, (...args) => baseEventHandler(eventName, args));
});
