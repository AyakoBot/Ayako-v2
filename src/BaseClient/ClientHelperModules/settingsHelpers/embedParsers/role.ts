import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for role type settings.
 * @param val - The role ID to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the role.
 */
export default (val: string | null, language: CT.Language) =>
 val?.length ? `<@&${val}>` : language.t.None;
