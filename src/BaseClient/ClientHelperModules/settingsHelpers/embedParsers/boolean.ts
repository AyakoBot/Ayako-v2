import * as CT from '../../../../Typings/CustomTypings.js';
import emotes from '../../emotes.js';
import constants from '../../../Other/constants.js';

/**
 * Parser for boolean type settings.
 * @param val - The boolean value to parse.
 * @param language - The language object containing translations.
 * @returns A string representation of the boolean value.
 */
export default (val: boolean | undefined, language: CT.Language) =>
 val
  ? `${constants.standard.getEmote(emotes.enabled)} ${language.t.Enabled}`
  : `${constants.standard.getEmote(emotes.disabled)} ${language.t.Disabled}`;
