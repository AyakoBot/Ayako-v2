import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Parser for author type settings.
 * @param language - The language object containing translations.
 * @param lan - The name of the author type.
 * @returns An object containing the author's icon URL, name, and URL.
 */
export default <T extends keyof S.Categories>(language: CT.Language, lan: S.Categories[T]) => ({
 icon_url: language.client.util.emotes.settings.link,
 name: language.slashCommands.settings.authorType(lan.name),
 url: language.client.util.constants.standard.invite,
});
