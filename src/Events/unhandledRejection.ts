/* eslint-disable no-console */
import type * as Discord from 'discord.js';
import auth from '../auth.json' assert { type: 'json' };
import client from '../BaseClient/Client.js';

export default (error: Error) => {
  const { id, token } = client.ch.util.webhookURLToIDAndToken(auth.debugWebhook);
  if (!id || !token) return;

  // DO NOT SEND ERRORS FROM NON PRODUCTION
  if (client.id !== BigInt(auth.mainID)) {
    console.error(error);
    return;
  }

  console.error(error ?? `An unhandled rejection error occurred but error was null or undefined`);

  if (!error) return;

  const embed: DDeno.Embed = {
    description: ['```js', error.stack, '```'].join(`\n`),
    timestamp: Date.now(),
    footer: {
      text: 'Unhandled Rejection Error Occurred',
    },
  };

  client.helpers
    .sendWebhookMessage(client.transformers.snowflake(id), token, {
      embeds: [embed],
    })
    .catch(console.error);
};
