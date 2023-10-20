import DataBase from '../../DataBase.js';
import * as CT from '../../../Typings/CustomTypings.js';

/**
 * Sets up a database query based on the provided table name,
 *  guild ID, and unique timestamp (optional).
 * @param tableName - The name of the table to query.
 * @param guildid - The ID of the guild to query.
 * @param uniquetimestamp - An optional unique timestamp to include in the query.
 * @returns A database query object based on the provided parameters.
 */
export default (tableName: keyof CT.TableNamesMap, guildid: string, uniquetimestamp?: number) => {
 const getDBType = () => {
  if (uniquetimestamp) {
   const where = { data: { uniquetimestamp, guildid } };

   switch (tableName) {
    // case 'appeal-questions':
    //  return DataBase.appealquestions.create(where);
    case 'shop-items':
     return DataBase.shopitems.create(where);
    case 'vote-rewards':
     return DataBase.voterewards.create(where);
    case 'auto-punish':
     return DataBase.autopunish.create(where);
    case 'role-rewards':
     return DataBase.rolerewards.create(where);
    case 'cooldowns':
     return DataBase.cooldowns.create(where);
    case 'self-roles':
     return DataBase.selfroles.create(where);
    case 'separators':
     return DataBase.roleseparator.create(where);
    case 'vote':
     return DataBase.votesettings.create(where);
    case 'multi-channels':
     return DataBase.levelingmultichannels.create(where);
    case 'multi-roles':
     return DataBase.levelingmultiroles.create(where);
    case 'level-roles':
     return DataBase.levelingroles.create(where);
    case 'rule-channels':
     return DataBase.levelingruleschannels.create(where);
    case 'button-role-settings':
     return DataBase.buttonrolesettings.create(where);
    case 'reaction-role-settings':
     return DataBase.reactionrolesettings.create(where);
    case 'reaction-roles':
     return DataBase.reactionroles.create(where);
    case 'button-roles':
     return DataBase.buttonroles.create(where);
    case 'booster-roles':
     return DataBase.nitroroles.create(where);
    default:
     throw new Error(`Unsupported Setting ${tableName}`);
   }
  } else {
   const where = { data: { guildid } };

   switch (tableName) {
    case 'basic':
     return DataBase.guildsettings.create(where);
    case 'shop':
     return DataBase.shop.create(where);
    case 'anti-spam':
     return DataBase.antispam.create(where);
    case 'anti-virus':
     return DataBase.antivirus.create(where);
    case 'censor':
     return DataBase.censor.create(where);
    case 'newlines':
     return DataBase.newlines.create(where);
    case 'invites':
     return DataBase.invites.create(where);
    case 'expiry':
     return DataBase.expiry.create(where);
    case 'auto-roles':
     return DataBase.autoroles.create(where);
    case 'disboard-reminders':
     return DataBase.disboard.create(where);
    case 'sticky':
     return DataBase.sticky.create(where);
    case 'suggestions':
     return DataBase.suggestionsettings.create(where);
    case 'logs':
     return DataBase.logchannels.create(where);
    case 'verification':
     return DataBase.verification.create(where);
    case 'leveling':
     return DataBase.leveling.create(where);
    case 'welcome':
     return DataBase.welcome.create(where);
    case 'nitro':
     return DataBase.nitrosettings.create(where);
    // case 'appealsettings':
    //  DataBase.appealsettings.create(where);

    default:
     throw new Error(`Unsupported Setting ${tableName}`);
   }
  }
 };

 return getDBType();
};
