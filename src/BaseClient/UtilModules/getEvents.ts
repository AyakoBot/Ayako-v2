import { glob } from 'glob';
import * as Discord from 'discord.js';

const eventPath = `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Events`;

export enum ProcessEvents {
 experimentalWarning = 'experimentalWarning',
 promiseRejectionHandledWarning = 'promiseRejectionHandledWarning',
 uncaughtException = 'uncaughtException',
 unhandledRejection = 'unhandledRejection',
}

// related to /BaseClient/Cluster/Socket.ts
enum MessageType {
 Appeal = 'appeal',
 Vote = 'vote',
 Interaction = 'interaction',
}

// realted to Discord.RestEvents
enum RestEvents {
 rateLimited,
 restDebug,
 response,
}

/**
 * Retrieves the bot events by scanning the specified event path.
 * @returns {Promise<string[]>} A promise that resolves to an array of bot events.
 */
export const getBotEvents = async () =>
 (await glob(`${eventPath}/BotEvents/**/*`))
  .filter((path) => path.endsWith('.js'))
  .filter((path) => {
   const eventName = path.replace('.js', '').split(/\/+/).pop();

   if (!eventName) return false;
   if (!Object.values(Discord.Events).includes(eventName as never)) return false;
   return true;
  });

/**
 * Retrieves the process events from the specified event path.
 * @returns {Promise<string[]>} A promise that resolves to an array of process event paths.
 */
export const getProcessEvents = async () =>
 (await glob(`${eventPath}/ProcessEvents/**/*`))
  .filter((path) => path.endsWith('.js'))
  .filter((path) => {
   const eventName = path.replace('.js', '').split(/\/+/).pop();

   if (!eventName) return false;
   if (!Object.values(ProcessEvents).includes(eventName as never)) return false;
   return true;
  });

/**
 * Retrieves the cluster events by scanning the specified event path.
 * @returns {Promise<string[]>} A promise that resolves to an array of cluster events.
 */
export const getClusterEvents = async () =>
 (await glob(`${eventPath}/ClusterEvents/**/*`))
  .filter((path) => path.endsWith('.js'))
  .filter((path) => {
   const eventName = path.replace('.js', '').split(/\/+/).pop();

   if (!eventName) return false;
   if (!Object.values(MessageType).includes(eventName as never)) return false;
   return true;
  });

export const getRestEvents = async () =>
 (await glob(`${eventPath}/RestEvents/**/*`))
  .filter((path) => path.endsWith('.js'))
  .filter((path) => {
   const eventName = path.replace('.js', '').split(/\/+/).pop();

   if (!eventName) return false;
   if (!Object.values(RestEvents).includes(eventName as never)) return false;
   return true;
  });

const events = {
 ProcessEvents: await getProcessEvents(),
 ClusterEvents: await getClusterEvents(),
 BotEvents: await getBotEvents(),
 RestEvents: await getRestEvents(),
};

/**
 * Retrieves and returns the events for the client.
 * @returns {Promise<{ ProcessEvents: string[], ClusterEvents: string[], BotEvents: string[] }>}
 * The events for the client.
 */
export default events;
