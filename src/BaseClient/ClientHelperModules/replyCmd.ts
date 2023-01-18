import type DDeno from 'discordeno';
import type CT from '../../Typings/CustomTypings';
import client from '../Client.js';

export default async (
  cmd: DDeno.Interaction | CT.ButtonInteraction,
  payload: CT.InteractionResponse,
  command?: CT.Command,
) => {
  if (!cmd) return null;
  if (!payload.data) return null;

  const ephemeral = Boolean(payload.ephemeral);
  if (payload.ephemeral) {
    delete payload.ephemeral;
    payload.data.flags = payload.data.flags ? payload.data.flags + 64 : 64;
  }

  await client.helpers.sendInteractionResponse(cmd.id, cmd.token, payload).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('cmd reply err', err);
  });

  const sentMessage = await client.helpers
    .getOriginalInteractionResponse(cmd.token)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('cmd reply fetch err', err);
    });

  if (!sentMessage) return null;
  if (ephemeral) return sentMessage;

  const replyMsg = await import('./replyMsg');
  replyMsg.cooldownHandler(cmd, sentMessage, command);
  replyMsg.deleteCommandHandler(cmd, sentMessage, command);

  return sentMessage;
};
