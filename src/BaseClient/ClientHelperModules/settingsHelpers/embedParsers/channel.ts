import * as CT from '../../../../Typings/Typings.js';

/**
 * Parser for channel type settings.
 * @param val - The channel ID to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the channel.
 */
export default (val: string | null, language: CT.Language) =>
 val?.length ? `<#${val}>` : language.t.None;
