import type DDeno from 'discordeno';
import type CT from '../../Typings/CustomTypings';
import constants from '../Other/Constants.json' assert { type: 'json' };
import reply from './replyCmd.js';

export default (
  interaction: CT.ButtonInteraction,
  language: typeof import('../../Languages/en.json'),
) => {
  const embed: DDeno.Embed = {
    type: 'rich',
    author: {
      name: language.error,
      iconUrl: constants.standard.error,
      url: constants.standard.invite,
    },
    color: constants.colors.warning,
    description: language.errors.notYours,
  };

  reply(interaction, { data: { embeds: [embed] }, ephemeral: true, type: 4 });
};
