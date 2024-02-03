import type * as CT from '../../../Typings/Typings.js';
import type * as S from '../../../Typings/Settings.js';

export enum GlobalDescType {
 BLChannelId = 'blchannelid',
 BLRoleId = 'blroleid',
 BLUserId = 'bluserid',
 WLChannelId = 'wlchannelid',
 WLRoleId = 'wlroleid',
 WLUserId = 'wluserid',
 Active = 'active',
}

/**
 * Returns the description for a given type based on the provided language.
 * @param type - The type to get the description for.
 * @param language - The language object containing the descriptions.
 * @returns The description for the given type.
 */
export default (type: GlobalDescType | S.AutoModEditorType, language: CT.Language) => {
 switch (type) {
  case GlobalDescType.BLChannelId:
  case GlobalDescType.BLRoleId:
  case GlobalDescType.BLUserId:
  case GlobalDescType.WLChannelId:
  case GlobalDescType.WLRoleId:
  case GlobalDescType.WLUserId:
   return language.slashCommands.settings.BLWL[type];
  case GlobalDescType.Active:
   return language.slashCommands.settings.active;
  case language.client.util.CT.AutoModEditorType.Channel:
   return language.events.logs.automodRule.alertChannel;
  case language.client.util.CT.AutoModEditorType.Roles:
   return language.events.logs.automodRule.exemptRoles;
  case language.client.util.CT.AutoModEditorType.Channels:
   return language.events.logs.automodRule.exemptChannels;
  default:
   language.client.util.logError(new Error(`Unknown Type ${type}`), true);
   return language.t.Unknown;
 }
};
