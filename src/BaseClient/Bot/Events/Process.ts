import baseEventHandler from '../../../Events/BotEvents/baseEventHandler.js';
import events, { ProcessEvents } from '../../UtilModules/getEvents.js';

events.ProcessEvents.forEach((path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop() as ProcessEvents;
 if (!eventName) return;

 process.on(eventName, (...args) => baseEventHandler(eventName, args));
});
