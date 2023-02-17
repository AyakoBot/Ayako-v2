import readline from 'readline';
import client from './BaseClient/Client.js';
import * as ch from './BaseClient/ClientHelper.js';

const events = await ch.getEvents();
client.setMaxListeners(events.length);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
  try {
    // eslint-disable-next-line no-console
    console.log(
      msg.includes('await') || msg.includes('return')
        ? // eslint-disable-next-line no-eval
          await eval(`(async () => {${msg}})()`)
        : // eslint-disable-next-line no-eval
          eval(msg),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
});

process.setMaxListeners(4);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));

events.forEach(async (path) => {
  const eventName = path.replace('.js', '').split(/\/+/).pop();
  if (!eventName) return;

  const eventHandler = (await import('./Events/baseEventHandler.js')).default;

  if (eventName === 'ready') client.once(eventName, (...args) => eventHandler(eventName, args));
  else client.on(eventName, (...args) => eventHandler(eventName, args));
});

client.on('debug', (info) => {
  if (info.includes('Heartbeat')) return;

  // eslint-disable-next-line no-console
  console.log(info);
});

client.on('warn', (info) => {
  console.log(info);
});
