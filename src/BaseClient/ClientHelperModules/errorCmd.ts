import * as Discord from 'discord.js';
import reply from './replyCmd.js';
import objectEmotes from './objectEmotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';

export default (
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
  (m && m instanceof Discord.Message && m.editable) ||
  m instanceof Discord.InteractionResponse
 ) {
  return m.edit({ embeds: [embed] }).catch(() => undefined);
 }

 return reply(cmd, { embeds: [embed], ephemeral: true });
};
