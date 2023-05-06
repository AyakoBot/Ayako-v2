import type * as Discord from 'discord.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings';

export default (msg: Discord.Message, language: CT.Language) => {
 const embed: Discord.APIEmbed = {
  description: language.errors.time,
  color: constants.colors.danger,
 };

 return msg.edit({ embeds: [embed], components: [] });
};
