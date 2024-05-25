import * as CT from '../../../Typings/Typings.js';
import DataBase from '../../Bot/DataBase.js';

/**
 * Deletes a row from the specified table in the database
 * based on the unique timestamp and guild ID.
 * @param tableName - The name of the table to delete the row from.
 * @param guildid - The ID of the guild where the row exists.
 * @param uniquetimestamp - The unique timestamp of the row to delete.
 * @returns A promise that resolves to the number of rows deleted from the table.
 * @throws An error if the specified table name is not supported.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 tableName: T,
 guildid: string,
 uniquetimestamp: number,
): CT.CRUDResult<T> => {
 const where = { where: { uniquetimestamp, guildid } };

 return (
  DataBase[CT.SettingsName2TableName[tableName]] as never as {
   delete: (x: typeof where) => CT.CRUDResult<T>;
  }
 ).delete(where);
};
