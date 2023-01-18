import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import constants from '../Other/Constants.js';
import reply from './replyCmd.js';

export default (interaction: Discord.ButtonInteraction, language: CT.Language) => {
  const embed: Discord.APIEmbed = {
    author: {
      name: language.error,
      icon_url: constants.standard.error,
      url: constants.standard.invite,
    },
    color: constants.colors.warning,
    description: language.errors.notYours,
  };

  reply(interaction, { data: { embeds: [embed] }, ephemeral: true, type: 4 });
};
