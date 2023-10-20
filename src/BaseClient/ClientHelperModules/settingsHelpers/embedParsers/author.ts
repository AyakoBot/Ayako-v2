import * as CT from '../../../../Typings/CustomTypings.js';
import emotes from '../../emotes.js';
import constants from '../../../Other/constants.js';

/**
 * Parser for author type settings.
 * @param language - The language object containing translations.
 * @param lan - The name of the author type.
 * @returns An object containing the author's icon URL, name, and URL.
 */
export default <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 lan: CT.SettingsNames[T],
) => ({
 icon_url: emotes.settings.link,
 name: language.slashCommands.settings.authorType(lan.name),
 url: constants.standard.invite,
});
