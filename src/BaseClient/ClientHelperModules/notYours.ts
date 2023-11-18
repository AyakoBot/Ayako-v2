import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings.js';
import constants from '../Other/constants.js';
import reply from './replyCmd.js';

/**
 * Sends an error message to the user indicating that the requested resource is not theirs.
 * @param interaction - The button interaction that triggered the error message.
 * @param language - An object containing the language strings to use for the error message.
 */
export default (interaction: Discord.ButtonInteraction, language: CT.Language) =>
 reply(interaction, {
  embeds: [
   {
    author: {
     name: language.t.error,
     icon_url: constants.standard.error,
     url: constants.standard.invite,
    },
    color: constants.colors.danger,
    description: language.t.errors.notYours,
   },
  ],
  ephemeral: true,
 });
