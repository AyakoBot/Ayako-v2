import query from './query';
import type DBT from '../../Typings/DataBaseTypings';

export default async (uniquetimestamp: number) =>
  query(`SELECT * FROM customembeds WHERE uniquetimestamp = $1;`, [uniquetimestamp]).then(
    (r: DBT.customembeds[] | null) => (r ? r[0] : null),
  );
