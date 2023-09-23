import DataBase from '../DataBase.js';
import type CT from '../../Typings/CustomTypings.js';

/**
 * Returns the language object for the specified guild ID.
 * If the guild ID is not provided or is falsy, returns the English language object.
 * @param guildID - The ID of the guild to get the language object for.
 * @returns A Promise that resolves to the language object for the specified guild ID.
 */
export default async (guildID: bigint | undefined | null | string): Promise<CT.Language> => {
 if (!guildID) return (await import(`../../Languages/en.js`)).default;

 const lan = await DataBase.guildsettings
  .findUnique({ where: { guildid: String(guildID) } })
  .then((r) => r?.lan);

 const { default: language } = await import(`../../Languages/${lan || 'en'}.js`);
 return language;
};
