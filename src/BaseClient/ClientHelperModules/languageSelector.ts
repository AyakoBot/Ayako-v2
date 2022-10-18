import query from './query';
import type DBT from '../../Typings/DataBaseTypings';

export default async (
  guildID: string | undefined | null,
): Promise<typeof import('../../Languages/en.json')> => {
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
