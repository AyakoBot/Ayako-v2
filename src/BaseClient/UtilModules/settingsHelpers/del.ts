import * as CT from '../../../Typings/Typings.js';
import DataBase from '../../DataBase.js';

/**
 * Deletes a row from the specified table in the database
 * based on the unique timestamp and guild ID.
 * @param tableName - The name of the table to delete the row from.
 * @param guildid - The ID of the guild where the row exists.
 * @param uniquetimestamp - The unique timestamp of the row to delete.
 * @returns A promise that resolves to the number of rows deleted from the table.
 * @throws An error if the specified table name is not supported.
 */
export default (
 tableName: keyof typeof CT.SettingsName2TableName,
 guildid: string,
 uniquetimestamp: number,
) => {
 const getDBType = () => {
  const where = { where: { uniquetimestamp, guildid } };

  switch (tableName) {
   case 'questions':
    return DataBase.appealquestions.delete(where);
   case 'shop-items':
    return DataBase.shopitems.delete(where);
   case 'vote-rewards':
    return DataBase.voterewards.delete(where);
   case 'auto-punish':
    return DataBase.autopunish.delete(where);
   case 'role-rewards':
    return DataBase.rolerewards.delete(where);
   case 'cooldowns':
    return DataBase.cooldowns.delete(where);
   case 'self-roles':
    return DataBase.selfroles.delete(where);
   case 'separators':
    return DataBase.roleseparator.delete(where);
   case 'vote':
    return DataBase.votesettings.delete(where);
   case 'multi-channels':
    return DataBase.levelingmultichannels.delete(where);
   case 'multi-roles':
    return DataBase.levelingmultiroles.delete(where);
   case 'level-roles':
    return DataBase.levelingroles.delete(where);
   case 'rule-channels':
    return DataBase.levelingruleschannels.delete(where);
   case 'button-role-settings':
    return DataBase.buttonrolesettings.delete(where);
   case 'reaction-role-settings':
    return DataBase.reactionrolesettings.delete(where);
   case 'reaction-roles':
    return DataBase.reactionroles.delete(where);
   case 'button-roles':
    return DataBase.buttonroles.delete(where);
   case 'booster-roles':
    return DataBase.nitroroles.delete(where);
   case 'voice-hubs':
    return DataBase.voicehubs.delete(where);
   default:
    throw new Error(`Unsupported Setting ${tableName}`);
  }
 };

 return getDBType();
};
