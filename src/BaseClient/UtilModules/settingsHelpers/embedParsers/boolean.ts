import type * as CT from '../../../../Typings/Typings.js';

/**
 * Parser for boolean type settings.
 * @param val - The boolean value to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the boolean value.
 */
export default (val: boolean | undefined, language: CT.Language) =>
 val
  ? `${language.client.util.constants.standard.getEmote(language.client.util.emotes.enabled)} ${
     language.t.Enabled
    }`
  : `${language.client.util.constants.standard.getEmote(language.client.util.emotes.disabled)} ${
     language.t.Disabled
    }`;
