import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import * as replyMsg from './replyMsg.js';

const sendMessage = (
 cmd:
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 payload: Discord.InteractionReplyOptions,
) => {
 if ('respond' in cmd) {
  return undefined;
 }

 payload.ephemeral = true;

 if ('reply' in cmd && cmd.isRepliable()) {
  return cmd.reply(payload).catch((err) => {
   // eslint-disable-next-line no-console
   console.log('cmd reply err', err);
  });
 }

 throw new Error('Unrepliable Interaction');
};

export default async (
 cmd:
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 payload: Discord.InteractionReplyOptions,
 command?: CT.Command,
) => {
 if (!cmd) return undefined;
 if (!cmd.guild) return undefined;

 const sentMessage = await sendMessage(cmd, payload);
 if (!sentMessage) return null;

 if (command) {
  replyMsg.cooldownHandler(cmd, sentMessage, command);
  replyMsg.deleteCommandHandler(cmd, sentMessage, command);
 }

 return sentMessage;
};
