import type * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

/**
 * Sends an error message to the user indicating that the requested resource is not theirs.
 * @param interaction - The button interaction that triggered the error message.
 * @param language - An object containing the language strings to use for the error message.
 */
export default (cmd: Discord.ButtonInteraction, language: CT.Language) =>
 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: language.t.error,
     icon_url: cmd.client.util.constants.standard.error,
     url: cmd.client.util.constants.standard.invite,
    },
    color: cmd.client.util.CT.Colors.Danger,
    description: language.errors.notYours,
   },
  ],
  ephemeral: true,
 });
