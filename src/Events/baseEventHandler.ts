import getEvents from '../BaseClient/ClientHelperModules/getEvents.js';

export default async (eventName: string, args: unknown[]) => {
  const events = getEvents();
  const event = events.find((e) => e.endsWith(`${eventName}.js`));
  if (!event) return;

  (await import(event)).default(...args);
};
