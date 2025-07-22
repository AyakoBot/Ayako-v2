import * as CT from '../../../../Typings/Typings.js';
import emotes from '../../emotes.js';
import constants from '../../../Other/constants.js';

/**
 * Parser for component authors.
 * @param language - The language object containing translations.
 * @param lan - The name of the author type.
 * @returns A string for component authors
 */
export default <T extends keyof CT.Categories>(language: CT.Language, lan: CT.Categories[T]) =>
 `${constants.standard.getEmote(emotes.settings)} [${language.slashCommands.settings.authorType(lan.name)}](${constants.standard.invite})`;
