import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for user type settings.
 * @param val - The user ID to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the user.
 */
export default (val: string | null, language: CT.Language) =>
 val?.length ? `<@${val}>` : language.t.None;
