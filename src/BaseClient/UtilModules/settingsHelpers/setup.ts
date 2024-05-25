import * as CT from '../../../Typings/Typings.js';
import DataBase from '../../Bot/DataBase.js';

/**
 * Sets up a database query based on the provided table name,
 *  guild ID, and unique timestamp (optional).
 * @param tableName - The name of the table to query.
 * @param guildid - The ID of the guild to query.
 * @param uniquetimestamp - An optional unique timestamp to include in the query.
 * @returns A database query object based on the provided parameters.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 tableName: T,
 guildid: string,
 uniquetimestamp?: number,
): CT.CRUDResult<T> => {
 const where = uniquetimestamp ? { data: { uniquetimestamp, guildid } } : { data: { guildid } };

 return (
  DataBase[CT.SettingsName2TableName[tableName]] as never as {
   create: (x: typeof where) => CT.CRUDResult<T>;
  }
 ).create(where);
};
