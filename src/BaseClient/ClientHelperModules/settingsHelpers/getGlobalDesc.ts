import * as CT from '../../../Typings/Typings.js';

// eslint-disable-next-line no-console
const { log } = console;

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
export default (type: GlobalDescType | CT.AutoModEditorType, language: CT.Language) => {
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
  case CT.AutoModEditorType.Channel:
   return language.events.logs.automodRule.alertChannel;
  case CT.AutoModEditorType.Roles:
   return language.events.logs.automodRule.exemptRoles;
  case CT.AutoModEditorType.Channels:
   return language.events.logs.automodRule.exemptChannels;
  default:
   log(new Error(`Unknown Type ${type}`));
   return language.t.Unknown;
 }
};
