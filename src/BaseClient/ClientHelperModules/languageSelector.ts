import query from './query.js';
import type CT from '../../Typings/CustomTypings';

export default async (guildID: bigint | undefined | null | string): Promise<CT.Language> => {
 if (!guildID) {
  const language = (await import(`../../Languages/en.js`)).default;

  return language;
 }

 const lan = await query('SELECT lan FROM guildsettings WHERE guildid = $1;', [String(guildID)], {
  returnType: 'guildsettings',
  asArray: false,
 }).then((r) => r?.lan);

 const { default: language } = await import(`../../Languages/${lan || 'en'}.js`);
 return language;
};
