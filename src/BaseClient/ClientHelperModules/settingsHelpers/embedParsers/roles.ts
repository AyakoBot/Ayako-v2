import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for roles type settings.
 * @param val - The array of role IDs to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the roles.
 */
export default (val: string[] | null, language: CT.Language) =>
 val?.length ? val.map((c) => `<@&${c}>`).join(', ') : language.None;
