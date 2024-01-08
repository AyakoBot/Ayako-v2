import type * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import reply from './replyMsg.js';
import objectEmotes from './emotes.js';
import constants from '../Other/constants.js';
import { request } from './requestHandler.js';
import error from './error.js';
import isEditable from './isEditable.js';

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
   icon_url: objectEmotes.warning.link,
   url: constants.standard.invite,
  },
  color: CT.Colors.Danger,
  description: content,
 };

 if (m && (await isEditable(m))) {
  const ms = await request.channels.editMsg(m, { embeds: [embed] });
  if ('message' in ms) {
   if (msg.inGuild()) error(msg.guild, new Error(`Couldnt get Guild Webhooks`));
   return undefined;
  }

  return ms as T;
 }

 return reply(msg, { embeds: [embed] });
};
