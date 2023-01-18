import query from './query.js';
import type DBT from '../../Typings/DataBaseTypings';
import type CT from '../../Typings/CustomTypings';

export default async (guildID: bigint | undefined | null | string): Promise<CT.Language> => {
  if (!guildID) {
    const language = (await import(`../../Languages/en.js`)).default;

    return language;
  }

  const lan = await query('SELECT lan FROM guildsettings WHERE guildid = $1;', [
    String(guildID),
  ]).then((r: DBT.guildsettings[] | null) => (r ? r[0].lan : null));

  const { default: language } = await import(`../../Languages/${lan || 'en'}.js`, {
    assert: { type: 'json' },
  });
  return language;
};
