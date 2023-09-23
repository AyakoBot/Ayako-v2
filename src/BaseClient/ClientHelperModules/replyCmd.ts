import * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings.js';
import * as replyMsg from './replyMsg.js';
import constants from '../Other/constants.js';
import error from './error.js';

type ReturnType<T extends boolean | undefined, K extends Discord.CacheType> = T extends true
 ? K extends 'cached'
   ? Discord.InteractionResponse<true> | undefined
   : Discord.InteractionResponse<false> | undefined
 : undefined;

/**
 * Sends a reply to an interaction (button, command, select menu, or modal submit).
 * @param cmd The interaction to reply to.
 * @param payload The reply options to send.
 * @returns If `fetchReply` is `true`, returns the message that was sent.
 * Otherwise, returns `undefined`.
 * @throws If the interaction is not repliable.
 */
const replyCmd = async <T extends boolean | undefined, K extends Discord.CacheType>(
 cmd:
  | Discord.ButtonInteraction<K>
  | Discord.CommandInteraction<K>
  | Discord.AnySelectMenuInteraction<K>
  | Discord.ModalSubmitInteraction<K>,
 payload: Discord.InteractionReplyOptions & {
  fetchReply?: T;
 },
): Promise<ReturnType<T, K>> => {
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
  const m = await cmd.reply(payload).catch((e) => {
   if (cmd.guild) error(cmd.guild, e);
   return undefined;
  });
  if (typeof m === 'undefined') return m;
  return m as ReturnType<T, K>;
 }

 throw new Error('Unrepliable Interaction');
};

/**
 * Sends a reply to a Discord interaction and handles cooldowns if provided.
 * @param cmd The interaction to reply to.
 * @param payload The reply options to send.
 * @param command The command that triggered the interaction.
 * @param commandName The name of the command that triggered the interaction.
 * @returns The sent message if `fetchReply` is `true`, otherwise `undefined`.
 */
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
): Promise<ReturnType<T, K>> => {
 if (!cmd) return undefined;

 const sentMessage = await replyCmd(cmd, payload);
 if (!sentMessage) return undefined;

 if (command && commandName) replyMsg.cooldownHandler(cmd, sentMessage, command, commandName);

 return sentMessage;
};
