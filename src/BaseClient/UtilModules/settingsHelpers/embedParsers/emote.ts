import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

/**
 * Parser for emote type settings.
 * @param val - The emote string to parse.
 * @param language - The language object containing translations.
 * @returns The emote string or the "None" string if the value is falsy.
 */
export default (val: string | null, language: CT.Language) =>
 val
  ? `${!Discord.parseEmoji(val)?.id ? val : `<${val.startsWith('a:') ? '' : ':'}${val}>`}`
  : language.t.None;
