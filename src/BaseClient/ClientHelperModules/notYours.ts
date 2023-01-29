import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import constants from '../Other/Constants.js';
import reply from './replyCmd.js';

export default (interaction: Discord.ButtonInteraction, language: CT.Language) =>
  reply(interaction, {
    embeds: [
      {
        author: {
          name: language.error,
          icon_url: constants.standard.error,
          url: constants.standard.invite,
        },
        color: constants.colors.danger,
        description: language.errors.notYours,
      },
    ],
    ephemeral: true,
  });
