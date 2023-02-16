import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

const sendMessage = (cmd: Discord.Interaction, payload: Discord.InteractionReplyOptions) => {
  if ('respond' in cmd) {
    return undefined;
  }

  if ('reply' in cmd && cmd.isRepliable()) {
    return cmd.reply(payload).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('cmd reply err', err);
    });
  }

  throw new Error('Unrepliable Interaction');
};

export default async (
  cmd: Discord.Interaction,
  payload: Discord.InteractionReplyOptions,
  command?: CT.Command,
) => {
  if (!cmd) return undefined;
  if (!cmd.guild) return undefined;

  const sentMessage = await sendMessage(cmd, payload);
  if (!sentMessage) return null;

  const replyMsg = await import('./replyMsg');

  if (command) {
    replyMsg.cooldownHandler(cmd, sentMessage, command);
    replyMsg.deleteCommandHandler(cmd, sentMessage, command);
  }

  return sentMessage;
};
