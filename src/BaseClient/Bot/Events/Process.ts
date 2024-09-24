import baseEventHandler from '../../../Events/BotEvents/baseEventHandler.js';
import events, { type ProcessEvents } from '../../UtilModules/getEvents.js';

// eslint-disable-next-line import/no-named-as-default-member
events.ProcessEvents.forEach((path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop() as ProcessEvents;
 if (!eventName) return;

 process.on(eventName, (...args) => baseEventHandler(eventName, args));
});
