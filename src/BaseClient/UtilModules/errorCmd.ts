import * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

/**
 * Sends an error message to the user in response to an interaction.
 * @param cmd - The interaction that triggered the error.
 * @param content - The error message to send.
 * @param language - The language object containing localized strings.
 * @param m - Optional existing message to edit instead of sending a new one.
 * @returns A Promise that resolves to the sent message.
 */
export default async (
 cmd:
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 content: string | Error,
 language: CT.Language,
 m?: Discord.InteractionResponse | Discord.Message<true>,
) => {
 cmd.client.util.logError(typeof content === 'string' ? new Error(content) : content, false);

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
   icon_url: cmd.client.util.emotes.warning.link,
   url: cmd.client.util.constants.standard.invite,
  },
  color: cmd.client.util.CT.Colors.Danger,
  description:
   typeof content === 'string' ? content : content.message.split(/:+/g).slice(1, 100).join(':'),
 };

 if (
  (m && m instanceof Discord.Message && (await cmd.client.util.isEditable(m))) ||
  m instanceof Discord.InteractionResponse
 ) {
  if (m instanceof Discord.InteractionResponse) m.edit({ embeds: [embed] }).catch(() => undefined);
  else cmd.client.util.request.channels.editMsg(m, { embeds: [embed] });
 }

 return cmd.client.util.replyCmd(cmd, { embeds: [embed], ephemeral: true });
};
