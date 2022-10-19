import query from './query.js';
import type DBT from '../../Typings/DataBaseTypings';
import type CT from '../../Typings/CustomTypings';

export default async (guildID: string | undefined | null): Promise<CT.Language> => {
  if (!guildID) {
    const { default: language } = await import(`../../Languages/en.json`, {
      assert: { type: 'json' },
    });

    return language;
  }

  const lan = await query('SELECT lan FROM guildsettings WHERE guildid = $1;', [guildID]).then(
    (r: DBT.guildsettings[] | null) => (r ? r[0].lan : null),
  );

  const { default: language } = await import(`../../Languages/${lan || 'en'}.json`, {
    assert: { type: 'json' },
  });
  return language;
};
