import { glob } from 'glob';
import * as Discord from 'discord.js';

/**
 * Retrieves all valid event files from the Events directory.
 * @returns A Promise that resolves to an array of filtered event files.
 */
export default async () => {
 const events = await glob(`${process.cwd()}/Events/**/*`);

 const filteredEvents = events
  .filter((path) => path.endsWith('.js'))
  .filter((path) => {
   const eventName = path.replace('.js', '').split(/\/+/).pop();

   if (!eventName) return false;
   if (!Object.values(Discord.Events).includes(eventName as never)) return false;
   return true;
  });

 return filteredEvents;
};
