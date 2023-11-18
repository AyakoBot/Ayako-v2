import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for string type settings.
 * @param val - The string value to parse.
 * @param language - The language object containing translations.
 * @returns The string value or the "None" string if the value is falsy.
 */
export default (val: string | null | undefined, language: CT.Language) => val ?? language.t.None;
