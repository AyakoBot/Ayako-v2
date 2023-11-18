import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for users type settings.
 * @param val - The array of user IDs to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the users.
 */
export default (val: string[] | null, language: CT.Language) =>
 val?.length ? val.map((c) => `<@${c}>`).join(', ') : language.t.None;
