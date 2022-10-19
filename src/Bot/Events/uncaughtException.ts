/* eslint-disable no-console */
import type * as DDeno from 'discordeno';
import auth from '../../auth.json' assert { type: 'json' };
import client from '../BaseClient/DDenoClient.js';

export default (error: Error) => {
  const { id, token } = client.ch.util.webhookURLToIDAndToken(auth.debugWebhook);
  if (!id || !token) return;

  if (client.id !== BigInt(auth.mainID)) {
    console.error(error);
    return;
  }

  console.error(error ?? `An unhandled exception occurred but error was null or undefined`);

  if (!error) process.exit(1);

  const embed: DDeno.Embed = {
    description: ['```js', error.stack, '```'].join(`\n`),
    timestamp: Date.now(),
    footer: {
      text: 'Unhandled Exception Error Occurred',
    },
  };

  // SEND ERROR TO THE LOG CHANNEL ON THE DEV SERVER
  client.helpers
    .sendWebhookMessage(client.transformers.snowflake(id), token, { embeds: [embed] })
    .catch(console.error);
};
