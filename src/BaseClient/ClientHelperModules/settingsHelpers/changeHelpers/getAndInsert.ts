import * as CT from '../../../../Typings/CustomTypings.js';
import DataBase from '../../../DataBase.js';

export default (
 tableName: keyof CT.SettingsNames,
 fieldName: string,
 guildid: string,
 newSetting: unknown,
 uniquetimestamp: number | undefined,
) => {
 const getDBType = () => {
  if (uniquetimestamp) {
   const where = { where: { uniquetimestamp }, data: { [fieldName]: newSetting } };

   switch (tableName) {
    case 'questions':
     return DataBase.appealquestions.update(where);
    case 'shop-items':
     return DataBase.shopitems.update(where);
    case 'vote-rewards':
     return DataBase.voterewards.update(where);
    case 'auto-punish':
     return DataBase.autopunish.update(where);
    case 'role-rewards':
     return DataBase.rolerewards.update(where);
    case 'cooldowns':
     return DataBase.cooldowns.update(where);
    case 'self-roles':
     return DataBase.selfroles.update(where);
    case 'separators':
     return DataBase.roleseparator.update(where);
    case 'vote':
     return DataBase.votesettings.update(where);
    case 'multi-channels':
     return DataBase.levelingmultichannels.update(where);
    case 'multi-roles':
     return DataBase.levelingmultiroles.update(where);
    case 'level-roles':
     return DataBase.levelingroles.update(where);
    case 'rule-channels':
     return DataBase.levelingruleschannels.update(where);
    case 'button-role-settings':
     return DataBase.buttonrolesettings.update(where);
    case 'reaction-role-settings':
     return DataBase.reactionrolesettings.update(where);
    case 'reaction-roles':
     return DataBase.reactionroles.update(where);
    case 'button-roles':
     return DataBase.buttonroles.update(where);
    case 'booster-roles':
     return DataBase.nitroroles.update(where);
    case 'voice-hubs':
     return DataBase.voicehubs.update(where);
    default:
     throw new Error(`3 Unsupported Setting ${String(tableName)}`);
   }
  } else {
   const where = { where: { guildid }, data: { [fieldName]: newSetting } };

   switch (tableName) {
    case 'basic':
     return DataBase.guildsettings.update(where);
    case 'shop':
     return DataBase.shop.update(where);
    case 'anti-spam':
     return DataBase.antispam.update(where);
    case 'anti-virus':
     return DataBase.antivirus.update(where);
    case 'censor':
     return DataBase.censor.update(where);
    case 'newlines':
     return DataBase.newlines.update(where);
    case 'invites':
     return DataBase.invites.update(where);
    case 'expiry':
     return DataBase.expiry.update(where);
    case 'auto-roles':
     return DataBase.autoroles.update(where);
    case 'disboard-reminders':
     return DataBase.disboard.update(where);
    case 'sticky':
     return DataBase.sticky.update(where);
    case 'suggestions':
     return DataBase.suggestionsettings.update(where);
    case 'logs':
     return DataBase.logchannels.update(where);
    case 'verification':
     return DataBase.verification.update(where);
    case 'leveling':
     return DataBase.leveling.update(where);
    case 'welcome':
     return DataBase.welcome.update(where);
    case 'nitro':
     return DataBase.nitrosettings.update(where);
    case 'anti-raid':
     return DataBase.antiraid.update(where);
    case 'appeal-settings':
     return DataBase.appealsettings.update(where);
    default:
     throw new Error(`4 Unsupported Setting ${String(tableName)}`);
   }
  }
 };

 return getDBType();
};
