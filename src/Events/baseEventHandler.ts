import getEvents from '../BaseClient/ClientHelperModules/getEvents.js';

export default async (...args: unknown[]) => {
  const eventName = args.shift();
  const events = getEvents();
  const event = events.find((e) => e.endsWith(`${eventName}.js`));
  if (!event) return;

  (await import(event)).default(args);
};
