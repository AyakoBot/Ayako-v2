import DataBase from '../DataBase.js';
import type CT from '../../Typings/CustomTypings.js';

export default async (guildID: bigint | undefined | null | string): Promise<CT.Language> => {
 if (!guildID) return (await import(`../../Languages/en.js`)).default;

 const lan = await DataBase.guildsettings
  .findUnique({ where: { guildid: String(guildID) } })
  .then((r) => r?.lan);

 const { default: language } = await import(`../../Languages/${lan || 'en'}.js`);
 return language;
};
