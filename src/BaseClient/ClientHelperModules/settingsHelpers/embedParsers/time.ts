import * as CT from '../../../../Typings/CustomTypings.js';
import moment from '../../moment.js';

/**
 * Parser for time type settings.
 * @param val - The timestamp value to parse.
 * @param language - The language object containing translations.
 * @returns A moment.js object representing the timestamp value.
 */
export default (val: number | null, language: CT.Language) =>
 val ? moment(val, language) : language.t.None;
