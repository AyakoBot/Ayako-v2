import readline from 'readline';
import client from './BaseClient/Client.js';
import * as ClientHelper from './BaseClient/ClientHelper.js';

client.ch = ClientHelper;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
  if (msg === 'restart') process.exit();
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
process.on('unhandledRejection', async (error: string) => client.emit('unhandledRejection', error));
process.on('uncaughtException', async (error: string) => client.emit('uncaughtException', error));
process.on('promiseRejectionHandledWarning', (error: string) =>
  client.emit('uncaughtException', error),
);
process.on('experimentalWarning', (error: string) => client.emit('uncaughtException', error));
