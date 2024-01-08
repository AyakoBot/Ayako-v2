import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

/**
 * Parser for rules type settings.
 * @param val - The array of rule IDs to parse.
 * @param language - The language object containing translations.
 * @param guild - The Discord guild object.
 * @returns A string representation of the rules.
 */
export default (val: string[] | null, language: CT.Language, guild: Discord.Guild) =>
 val && val.length
  ? val.map((v) => `\`${guild.autoModerationRules.cache.get(v)?.name ?? v}\``).join(', ')
  : language.t.None;
