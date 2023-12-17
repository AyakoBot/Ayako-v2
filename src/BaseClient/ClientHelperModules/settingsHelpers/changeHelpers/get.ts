import * as CT from '../../../../Typings/CustomTypings.js';
import DataBase from '../../../DataBase.js';

import setup from '../setup.js';

export default async (
 tableName: keyof CT.TableNamesMap,
 guildid: string,
 uniquetimestamp: number | undefined,
) => {
 const getDBType = () => {
  if (uniquetimestamp) {
   const where = { where: { uniquetimestamp } };

   switch (tableName) {
    case 'questions':
     return DataBase.appealquestions.findUnique(where);
    case 'shop-items':
     return DataBase.shopitems.findUnique(where);
    case 'vote-rewards':
     return DataBase.voterewards.findUnique(where);
    case 'auto-punish':
     return DataBase.autopunish.findUnique(where);
    case 'role-rewards':
     return DataBase.rolerewards.findUnique(where);
    case 'cooldowns':
     return DataBase.cooldowns.findUnique(where);
    case 'self-roles':
     return DataBase.selfroles.findUnique(where);
    case 'separators':
     return DataBase.roleseparator.findUnique(where);
    case 'vote':
     return DataBase.votesettings.findUnique(where);
    case 'multi-channels':
     return DataBase.levelingmultichannels.findUnique(where);
    case 'multi-roles':
     return DataBase.levelingmultiroles.findUnique(where);
    case 'level-roles':
     return DataBase.levelingroles.findUnique(where);
    case 'rule-channels':
     return DataBase.levelingruleschannels.findUnique(where);
    case 'button-role-settings':
     return DataBase.buttonrolesettings.findUnique(where);
    case 'reaction-role-settings':
     return DataBase.reactionrolesettings.findUnique(where);
    case 'reaction-roles':
     return DataBase.reactionroles.findUnique(where);
    case 'button-roles':
     return DataBase.buttonroles.findUnique(where);
    case 'booster-roles':
     return DataBase.nitroroles.findUnique(where);
    case 'voice-hubs':
     return DataBase.voicehubs.findUnique(where);
    default:
     throw new Error(`1 Unsupported Setting ${tableName}`);
   }
  } else {
   const where = { where: { guildid } };

   switch (tableName) {
    case 'basic':
     return DataBase.guildsettings.findUnique(where);
    case 'shop':
     return DataBase.shop.findUnique(where);
    case 'anti-spam':
     return DataBase.antispam.findUnique(where);
    case 'anti-virus':
     return DataBase.antivirus.findUnique(where);
    case 'censor':
     return DataBase.censor.findUnique(where);
    case 'newlines':
     return DataBase.newlines.findUnique(where);
    case 'invites':
     return DataBase.invites.findUnique(where);
    case 'expiry':
     return DataBase.expiry.findUnique(where);
    case 'auto-roles':
     return DataBase.autoroles.findUnique(where);
    case 'disboard-reminders':
     return DataBase.disboard.findUnique(where);
    case 'sticky':
     return DataBase.sticky.findUnique(where);
    case 'suggestions':
     return DataBase.suggestionsettings.findUnique(where);
    case 'logs':
     return DataBase.logchannels.findUnique(where);
    case 'verification':
     return DataBase.verification.findUnique(where);
    case 'leveling':
     return DataBase.leveling.findUnique(where);
    case 'welcome':
     return DataBase.welcome.findUnique(where);
    case 'nitro':
     return DataBase.nitrosettings.findUnique(where);
    case 'anti-raid':
     return DataBase.antiraid.findUnique(where);
    case 'appeal-settings':
     return DataBase.appealsettings.findUnique(where);
    default:
     throw new Error(`2 Unsupported Setting ${tableName}`);
   }
  }
 };

 return getDBType().then((r) => {
  if (!r) setup(tableName, guildid, uniquetimestamp);

  return r ?? null;
 });
};
