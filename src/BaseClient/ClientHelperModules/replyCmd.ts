import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings.js';
import * as replyMsg from './replyMsg.js';
import constants from '../Other/constants.js';

// eslint-disable-next-line no-console
const { log } = console;

const replyCmd = (
 cmd:
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 payload: Discord.InteractionReplyOptions,
) => {
 if ('respond' in cmd) return undefined;

 if (payload.ephemeral !== false) payload.ephemeral = true;

 payload.embeds?.forEach((embed) => {
  if ('author' in embed && !embed.author?.url && embed.author?.name) {
   embed.author = { ...embed.author, url: constants.standard.invite };
  }
 });

 if ('reply' in cmd && cmd.isRepliable()) {
  return cmd.reply(payload).catch((err) => {
   log('cmd reply err', err);
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
 commandName?: string,
) => {
 if (!cmd) return undefined;

 const sentMessage = await replyCmd(cmd, payload);
 if (!sentMessage) return undefined;

 if (command && commandName) replyMsg.cooldownHandler(cmd, sentMessage, command, commandName);

 return sentMessage;
};
