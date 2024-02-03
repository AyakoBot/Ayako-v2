import type * as CT from '../../../../Typings/Typings.js';

/**
 * Parser for time type settings.
 * @param val - The timestamp value to parse.
 * @param language - The language object containing translations.
 * @returns A moment.js object representing the timestamp value.
 */
export default (val: number | null, language: CT.Language) =>
 val ? language.client.util.moment(val, language) : language.t.None;
