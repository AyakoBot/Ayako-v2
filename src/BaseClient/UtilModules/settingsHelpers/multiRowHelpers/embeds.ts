import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Generates an array of embeds for a given setting name.
 * @param fields - The array of fields to add to the embeds.
 * @param language - The language object containing the author text.
 * @param lan - The name of the setting being paginated.
 * @returns An array of APIEmbed objects.
 */
export default <T extends keyof S.Categories>(
 fields:
  | {
     name: string;
     value: string;
    }[]
  | undefined,
 language: CT.Language,
 lan: S.Categories[T],
): Discord.APIEmbed[] => [
 {
  author:
   language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.embedParsers.author.file.default(
    language,
    lan,
   ),
  fields: fields?.splice(0, 24) ?? [],
 },
];
