import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import embedParsers from '../embedParsers.js';

/**
 * Generates an array of embeds for a given setting name.
 * @param fields - The array of fields to add to the embeds.
 * @param language - The language object containing the author text.
 * @param lan - The name of the setting being paginated.
 * @returns An array of APIEmbed objects.
 */
export default <T extends keyof CT.Categories>(
 fields:
  | {
     name: string;
     value: string;
    }[]
  | undefined,
 language: CT.Language,
 lan: CT.Categories[T],
): Discord.APIEmbed[] => [
 {
  author: embedParsers.author(language, lan),
  fields: fields?.splice(0, 24) ?? [],
 },
];
