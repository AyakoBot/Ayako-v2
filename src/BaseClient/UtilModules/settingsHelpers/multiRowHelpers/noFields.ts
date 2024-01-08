import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

/**
 * Adds a "no fields found" message to the first embed if it has no fields.
 * @param embeds - The array of embeds to check.
 * @param language - The language object containing the message to display.
 */
export default (embeds: Discord.APIEmbed[], language: CT.Language) => {
 if (!embeds[0].fields?.length) {
  embeds[0].fields?.push({
   name: '\u200b',
   value: language.slashCommands.settings.noFields,
   inline: false,
  });
 }
};
