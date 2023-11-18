import DataBase from '../DataBase.js';

/**
 * Returns the language object for the specified guild ID.
 * If the guild ID is not provided or is falsy, returns the English language object.
 * @param guildID - The ID of the guild to get the language object for.
 * @returns A Promise that resolves to the language object for the specified guild ID.
 */
export default async (guildID: bigint | undefined | null | string) => {
 if (!guildID) {
  const { default: Lang } = await import('../Other/language.js');

  const lang = new Lang('en');
  await lang.init();

  return lang;
 }

 const lan = await DataBase.guildsettings
  .findUnique({ where: { guildid: String(guildID) } })
  .then((r) => r?.lan);

 const { default: Lang } = await import('../Other/language.js');
 const lang = new Lang(lan || 'en');
 await lang.init();

 return lang;
};
