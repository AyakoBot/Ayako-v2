import type * as Discord from 'discord.js';
import reply from './replyMsg.js';
import objectEmotes from './objectEmotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';
import { request } from './requestHandler.js';
import error from './error.js';
import isEditable from './isEditable.js';

export default async <T extends Discord.Message<boolean>>(
 msg: T,
 content: string,
 language: CT.Language,
 m?: Discord.Message<true>,
): Promise<T | undefined> => {
 const embed: Discord.APIEmbed = {
  author: {
   name: language.error,
   icon_url: objectEmotes.warning.link,
   url: constants.standard.invite,
  },
  color: constants.colors.danger,
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
