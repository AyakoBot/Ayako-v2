import type * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

const { log } = console;

/**
 * Sends an error message to a Discord channel or edits an existing message with the error message.
 * @param msg - The message object to reply to or edit.
 * @param content - The content of the error message.
 * @param language - The language object containing localized strings.
 * @param m - The message object to edit, if applicable.
 * @returns The edited message object or undefined if the message couldn't be edited.
 */
export default async <T extends Discord.Message<boolean>>(
 msg: T,
 content: string,
 language: CT.Language,
 m?: Discord.Message<true>,
): Promise<T | undefined> => {
 log(new Error(content));

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
   icon_url: msg.client.util.emotes.warning.link,
   url: msg.client.util.constants.standard.invite,
  },
  color: msg.client.util.CT.Colors.Danger,
  description: content,
 };

 if (m && (await msg.client.util.isEditable(m))) {
  const ms = await msg.client.util.request.channels.editMsg(m, { embeds: [embed] });
  if ('message' in ms) {
   if (msg.inGuild()) msg.client.util.error(msg.guild, new Error(`Couldnt get Guild Webhooks`));
   return undefined;
  }

  return ms as T;
 }

 return msg.client.util.replyMsg(msg, { embeds: [embed] });
};
