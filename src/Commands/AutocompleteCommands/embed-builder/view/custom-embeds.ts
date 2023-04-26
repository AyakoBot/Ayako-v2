import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';
import type * as DBT from '../../../../Typings/DataBaseTypings';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
  const value = cmd.options.get('embed', true).value as string | null;
  const embeds = await ch
    .query(`SELECT * FROM customembeds WHERE guildid = $1;`, [cmd.guildId])
    .then((r: DBT.customembeds[] | null) => r);

  return embeds
    ?.filter((e) => (value ? e.name.includes(value) : true))
    .map((e) => ({
      name: e.name,
      value: e.uniquetimestamp,
    }));
};

export default f;
