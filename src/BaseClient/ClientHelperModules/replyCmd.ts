import * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings.js';
import * as replyMsg from './replyMsg.js';
import constants from '../Other/constants.js';
import error from './error.js';

const replyCmd = async <T extends boolean | undefined, K extends Discord.CacheType>(
 cmd:
  | Discord.ButtonInteraction<K>
  | Discord.CommandInteraction<K>
  | Discord.AnySelectMenuInteraction<K>
  | Discord.ModalSubmitInteraction<K>,
 payload: Discord.InteractionReplyOptions & {
  fetchReply?: T;
 },
): Promise<
 T extends true
  ? K extends 'cached'
    ? Discord.Message<true> | undefined
    : Discord.Message<false> | undefined
  : void
> => {
 if ('respond' in cmd) return Promise.resolve(undefined);

 if (payload.ephemeral === false) payload.flags = undefined;
 else payload.flags = Discord.MessageFlags.Ephemeral;
 delete payload.ephemeral;

 payload.embeds?.forEach((embed) => {
  if ('author' in embed && !embed.author?.url && embed.author?.name) {
   embed.author = { ...embed.author, url: constants.standard.invite };
  }
 });

 if ('reply' in cmd && cmd.isRepliable()) {
  return cmd
   .reply({ ...payload, fetchReply: true })
   .then(() => undefined)
   .catch((e) => {
    if (cmd.guild) error(cmd.guild, e);
    return undefined;
   });
 }

 throw new Error('Unrepliable Interaction');
};

export default async <T extends boolean | undefined, K extends Discord.CacheType>(
 cmd:
  | Discord.ButtonInteraction<K>
  | Discord.CommandInteraction<K>
  | Discord.AnySelectMenuInteraction<K>
  | Discord.ModalSubmitInteraction<K>,
 payload: Discord.InteractionReplyOptions & {
  fetchReply?: T;
 },
 command?: CT.Command,
 commandName?: string,
): Promise<
 T extends true
  ? K extends 'cached'
    ? Discord.Message<true> | undefined
    : Discord.Message<false> | undefined
  : void
> => {
 if (!cmd) return undefined;

 const sentMessage = await replyCmd(cmd, payload);
 if (!sentMessage) return undefined;

 if (command && commandName) replyMsg.cooldownHandler(cmd, sentMessage, command, commandName);

 return sentMessage;
};
