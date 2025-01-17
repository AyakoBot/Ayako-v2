import * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import constants from '../Other/constants.js';

/**
 * Handles the guild-only command interaction.
 * @param cmd - The command interaction.
 */
export default async (
 cmd:
  | Discord.ChatInputCommandInteraction
  | Discord.MessageContextMenuCommandInteraction
  | Discord.UserContextMenuCommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ButtonInteraction
  | Discord.ModalSubmitInteraction,
) => {
 const language = await cmd.client.util.getLanguage('en-GB');

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
   icon_url: constants.standard.error,
   url: constants.standard.invite,
  },
  color: CT.Colors.Danger,
  description: language.t.guildOnly,
 };

 cmd.reply({
  embeds: [embed],
  ephemeral: true,
  withResponse: false,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Link,
      label: language.t.Invite,
      url: constants.standard.invite,
     },
    ],
   },
  ],
 });
};
