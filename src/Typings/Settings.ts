import type * as Discord from 'discord.js';
import type { MentionTypes } from '../BaseClient/UtilModules/settingsHelpers/getMention.js';
import type { ChangeSelectType } from '../BaseClient/UtilModules/settingsHelpers/getChangeSelectType.js';
import { ChannelTypes } from '../Commands/ButtonCommands/settings/editors/channel.js';
import { GlobalDescType } from '../BaseClient/UtilModules/settingsHelpers/getGlobalDesc.js';
import type { DataBaseTables } from './DataBase.js';

import type util from '../BaseClient/Bot/Util.js';
import * as DB from './DataBase.js';

export { MentionTypes, ChangeSelectType, ChannelTypes, GlobalDescType };

type Language = import('../BaseClient/Other/language.js').default;

export enum AutoModEditorType {
 Roles = 'autoModRule/roles',
 Channels = 'autoModRule/channels',
 Channel = 'autoModRule/channel',
}

export enum EditorTypes {
 Channel = 'channel',
 Channels = 'channels',
 Role = 'role',
 Roles = 'roles',
 User = 'user',
 Users = 'users',
 Mention = 'mention',
 Mentions = 'mentions',

 Boolean = 'boolean',
 Duration = 'duration',
 String = 'string',
 Language = 'language',
 Number = 'number',
 Punishment = 'punishment',
 AntiRaidPunishment = 'antiraid-punishment',
 Embed = 'embed',
 Token = 'token',
 BotToken = 'bot-token',
 Message = 'message',
 ShopType = 'shoptype',
 Emote = 'emote',
 Emotes = 'emotes',
 Command = 'command',
 AutoModRules = 'automodrules',
 SettingLink = 'settinglink',
 AutoPunishment = 'auto-punishment',
 LvlUpMode = 'lvlupmode',
 Strings = 'strings',
 QuestionType = 'question-type',
 Category = 'category',
 Voice = 'voice',
 Permission = 'permission',
 RoleMode = 'rolemode',
 Commands = 'commands',
 Questions = 'questions',
 Position = 'position',
 WeekendsType = 'weekends-type',
}

export const GlobalType = {
 [GlobalDescType.BLChannelId]: EditorTypes.Channels,
 [GlobalDescType.BLRoleId]: EditorTypes.Roles,
 [GlobalDescType.BLUserId]: EditorTypes.Users,
 [GlobalDescType.WLChannelId]: EditorTypes.Channels,
 [GlobalDescType.WLRoleId]: EditorTypes.Roles,
 [GlobalDescType.WLUserId]: EditorTypes.Users,
 [GlobalDescType.Active]: EditorTypes.Boolean,
};

export type Categories = Language['slashCommands']['settings']['categories'];
export type MatchingCategoryKeys = Extract<keyof typeof SettingsName2TableName, keyof Categories>;

export interface SettingsFile<K extends MatchingCategoryKeys> {
 getEmbeds: (
  embedParsers: (typeof util)['settingsHelpers']['embedParsers'],
  settings: DB.DataBaseTables[(typeof SettingsName2TableName)[K]],
  language: Language,
  lan: Categories[K],
  guild: Discord.Guild,
 ) => Discord.APIEmbed[] | Promise<Discord.APIEmbed[]>;
 getComponents: (
  buttonParsers: (typeof util)['settingsHelpers']['buttonParsers'],
  settings: DB.DataBaseTables[(typeof SettingsName2TableName)[K]],
  language: Language,
 ) =>
  | Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]
  | Promise<Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]>;
 showAll?: (
  cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
  language: Language,
  lan: Categories[K],
 ) => Promise<void>;
 showId?: (
  cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
  id: string,
  language: Language,
  lan: Categories[K],
 ) => Promise<void>;
 postChange?: (
  oldSetting: DB.DataBaseTables[(typeof SettingsName2TableName)[K]] | undefined,
  newSetting: DB.DataBaseTables[(typeof SettingsName2TableName)[K]] | undefined,
  changedSetting: keyof DB.DataBaseTables[(typeof SettingsName2TableName)[K]],
  guild: Discord.Guild,
  uniquetimestamp?: number | string,
 ) => Promise<void>;
}

export type FieldName<T extends keyof Categories> = Categories[T]['fields'];

export enum SettingNames {
 Shop = 'shop',
 ShopItems = 'shop-items',
 AntiSpam = 'anti-spam',
 AntiRaid = 'anti-raid',
 DenylistRules = 'denylist-rules',
 AntiVirus = 'anti-virus',
 AutoPunish = 'auto-punish',
 Censor = 'censor',
 AutoRoles = 'auto-roles',
 Cooldowns = 'cooldowns',
 Expiry = 'expiry',
 DisboardReminders = 'disboard-reminders',
 SelfRoles = 'self-roles',
 Separators = 'separators',
 Sticky = 'sticky',
 Verification = 'verification',
 Welcome = 'welcome',
 Leveling = 'leveling',
 Nitro = 'nitro',
 Suggestions = 'suggestions',
 Logs = 'logs',
 Basic = 'basic',
 MultiChannels = 'multi-channels',
 MultiRoles = 'multi-roles',
 LevelRoles = 'level-roles',
 RuleChannels = 'rule-channels',
 BoosterRoles = 'booster-roles',
 Vote = 'vote',
 VoteRewards = 'vote-rewards',
 ReactionRoleSettings = 'reaction-role-settings',
 ButtonRoleSettings = 'button-role-settings',
 ReactionRoles = 'reaction-roles',
 ButtonRoles = 'button-roles',
 RoleRewards = 'role-rewards',
 Invites = 'invites',
 Newlines = 'newlines',
 VoiceHubs = 'voice-hubs',
 Appeals = 'appeals',
 Questions = 'questions',
 CustomClient = 'custom-client',
 Afk = 'afk',
 LinkedRolesDeco = 'linked-roles-deco',
}

export const SettingsName2TableName = {
 [SettingNames.Shop]: 'shop',
 [SettingNames.ShopItems]: 'shopitems',
 [SettingNames.AntiSpam]: 'antispam',
 [SettingNames.AntiRaid]: 'antiraid',
 [SettingNames.DenylistRules]: 'censor',
 [SettingNames.AntiVirus]: 'antivirus',
 [SettingNames.AutoPunish]: 'autopunish',
 [SettingNames.Censor]: 'censor',
 [SettingNames.AutoRoles]: 'autoroles',
 [SettingNames.Cooldowns]: 'cooldowns',
 [SettingNames.Expiry]: 'expiry',
 [SettingNames.DisboardReminders]: 'disboard',
 [SettingNames.SelfRoles]: 'selfroles',
 [SettingNames.Separators]: 'roleseparator',
 [SettingNames.Sticky]: 'sticky',
 [SettingNames.Verification]: 'verification',
 [SettingNames.Welcome]: 'welcome',
 [SettingNames.Leveling]: 'leveling',
 [SettingNames.Nitro]: 'nitrosettings',
 [SettingNames.Suggestions]: 'suggestionsettings',
 [SettingNames.Logs]: 'logchannels',
 [SettingNames.Basic]: 'guildsettings',
 [SettingNames.MultiChannels]: 'levelingmultichannels',
 [SettingNames.MultiRoles]: 'levelingmultiroles',
 [SettingNames.LevelRoles]: 'levelingroles',
 [SettingNames.RuleChannels]: 'levelingruleschannels',
 [SettingNames.BoosterRoles]: 'nitroroles',
 [SettingNames.Vote]: 'votesettings',
 [SettingNames.VoteRewards]: 'voterewards',
 [SettingNames.ReactionRoleSettings]: 'reactionrolesettings',
 [SettingNames.ButtonRoleSettings]: 'buttonrolesettings',
 [SettingNames.ReactionRoles]: 'reactionroles',
 [SettingNames.ButtonRoles]: 'buttonroles',
 [SettingNames.RoleRewards]: 'rolerewards',
 [SettingNames.Invites]: 'invites',
 [SettingNames.Newlines]: 'newlines',
 [SettingNames.VoiceHubs]: 'voicehubs',
 [SettingNames.Appeals]: 'appealsettings',
 [SettingNames.Questions]: 'appealquestions',
 [SettingNames.CustomClient]: 'customclients',
 [SettingNames.Afk]: 'afksettings',
 [SettingNames.LinkedRolesDeco]: 'linkedRolesDeco',
} as const;

export type CRUDResult<T extends keyof typeof SettingsName2TableName> = Promise<
 DataBaseTables[(typeof SettingsName2TableName)[T]]
>;
