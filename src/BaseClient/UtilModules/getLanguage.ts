import DataBase from '../Bot/DataBase.js';
import Lang from './cache/bot/language.js';
import Language, { languages } from '../Other/language.js';

/**
 * Returns the language object for the specified guild ID.
 * If the guild ID is not provided or is falsy, returns the English language object.
 * @param guildIdOrLocale - The ID of the guild to get the language object for or a language locale.
 * @returns A Promise that resolves to the language object for the specified guild ID.
 */
export default async (guildIdOrLocale: bigint | undefined | null | string) =>
 guildIdOrLocale && typeof guildIdOrLocale === 'string'
  ? (Lang.cache.get(guildIdOrLocale) ??
    Lang.set(await getLanguage(guildIdOrLocale), guildIdOrLocale))
  : getLanguage(guildIdOrLocale);

export const getLanguage = async (guildIdOrLocale: bigint | undefined | null | string) => {
 if (!guildIdOrLocale) return new Language('en-GB');

 if (typeof guildIdOrLocale === 'string' && guildIdOrLocale.includes('-')) {
  return new Language(guildIdOrLocale as keyof typeof languages);
 }

 const lan = await DataBase.guildsettings
  .findUnique({ where: { guildid: String(guildIdOrLocale) } })
  .then((r) => r?.lan);

 return new Language((lan || 'en-GB') as keyof typeof languages);
};
