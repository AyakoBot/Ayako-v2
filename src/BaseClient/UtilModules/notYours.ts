import type * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import constants from '../Other/constants.js';
import reply from './replyCmd.js';

/**
 * Sends an error message to the user indicating that the requested resource is not theirs.
 * @param interaction - The button interaction that triggered the error message.
 * @param language - An object containing the language strings to use for the error message.
 */
export default (
 interaction: Discord.ButtonInteraction | Discord.AnySelectMenuInteraction,
 language: CT.Language,
) =>
 reply(interaction, {
  embeds: [
   {
    author: {
     name: language.t.error,
     icon_url: constants.standard.error,
     url: constants.standard.invite,
    },
    color: CT.Colors.Danger,
    description: language.errors.notYours,
   },
  ],
  ephemeral: true,
 });
