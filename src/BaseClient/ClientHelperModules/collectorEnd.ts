import type * as Discord from 'discord.js';
import constants from '../Other/Constants.js';
import type CT from '../../Typings/CustomTypings';

export default (msg: Discord.Message, language: CT.Language) => {
  const embed: Discord.APIEmbed = {
    description: language.errors.time,
    color: constants.colors.warning,
  };

  return msg.edit({ embeds: [embed], components: [] });
};
