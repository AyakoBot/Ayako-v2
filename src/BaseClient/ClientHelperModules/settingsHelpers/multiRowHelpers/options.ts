import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

import buttonParsers from '../buttonParsers.js';

/**
 * Generates an array of action row components for a given setting name.
 * @param language - The language object containing the button text.
 * @param name - The name of the setting to generate buttons for.
 * @returns An array of action row components containing a single button.
 */
export default <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 name: T,
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [buttonParsers.create(language, name)],
 },
];
