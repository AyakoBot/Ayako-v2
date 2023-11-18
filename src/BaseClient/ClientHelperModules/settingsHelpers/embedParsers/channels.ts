import * as CT from '../../../../Typings/CustomTypings.js';

/**
 * Parser for channels type settings.
 * @param val - The array of channel IDs to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the channels.
 */
export default (val: string[] | undefined, language: CT.Language) =>
 val?.length ? val.map((c) => `<#${c}>`).join(', ') : language.t.None;
