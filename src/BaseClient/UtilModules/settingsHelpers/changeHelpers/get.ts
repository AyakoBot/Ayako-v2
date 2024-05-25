import * as CT from '../../../../Typings/Typings.js';
import DataBase from '../../../Bot/DataBase.js';
import setup from '../setup.js';

export default async <T extends keyof typeof CT.SettingsName2TableName>(
 tableName: T,
 guildid: string,
 uniquetimestamp: number | undefined,
): CT.CRUDResult<T> => {
 const getDBType = () => {
  const where = uniquetimestamp ? { where: { uniquetimestamp } } : { where: { guildid } };

  return (
   DataBase[CT.SettingsName2TableName[tableName]] as never as {
    findUnique: (x: typeof where) => CT.CRUDResult<T>;
   }
  ).findUnique(where);
 };

 return getDBType().then((r) => {
  if (!r) setup(tableName, guildid, uniquetimestamp);

  return r ?? null;
 });
};
