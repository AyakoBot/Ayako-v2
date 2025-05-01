import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import buttonParsers from '../buttonParsers.js';

/**
 * Adds pagination buttons to the beginning of the components array
 * if the number of fields exceeds 25.
 * @param embeds - The array of embeds to check.
 * @param components - The array of action row components to add the pagination buttons to.
 * @param language - The language object containing the button text.
 * @param name - The name of the setting being paginated.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 options: unknown[],
 components: Discord.APIActionRowComponent<Discord.APIComponentInMessageActionRow>[],
 language: CT.Language,
 name: T,
 page: number,
) => {
 if (!options) return;
 if (Number(options?.length) <= 25) return;

 components.unshift({
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.previous(language, name, page),
   buttonParsers.next(language, name, Math.ceil(options.length / 25) !== page + 1, page),
  ],
 });
};
