import * as Discord from 'discord.js';
import reply from './replyCmd.js';
import objectEmotes from './emotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';
import isEditable from './isEditable.js';
import { request } from './requestHandler.js';

export default async (
 cmd:
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 content: string,
 language: CT.Language,
 m?: Discord.InteractionResponse | Discord.Message<true>,
) => {
 const embed: Discord.APIEmbed = {
  author: {
   name: language.error,
   icon_url: objectEmotes.warning.link,
   url: constants.standard.invite,
  },
  color: constants.colors.danger,
  description: content,
 };

 if (
  (m && m instanceof Discord.Message && (await isEditable(m))) ||
  m instanceof Discord.InteractionResponse
 ) {
  if (m instanceof Discord.InteractionResponse) m.edit({ embeds: [embed] }).catch(() => undefined);
  else request.channels.editMsg(m, { embeds: [embed] });
 }

 return reply(cmd, { embeds: [embed], ephemeral: true });
};
