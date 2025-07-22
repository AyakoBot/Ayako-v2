import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export const getAPIRule = (rule: Discord.AutoModerationRule) => ({
 enabled: rule.enabled,
 trigger_metadata: {
  keyword_filter: rule.triggerMetadata.keywordFilter,
  regex_patterns: rule.triggerMetadata.regexPatterns,
  presets: rule.triggerMetadata.presets,
  allow_list: rule.triggerMetadata.allowList,
  mention_total_limit: rule.triggerMetadata.mentionTotalLimit ?? undefined,
  mention_raid_protection_enabled: rule.triggerMetadata.mentionRaidProtectionEnabled,
 },
 actions:
  rule.actions?.map((a) => ({
   type: a.type,
   metadata: {
    duration_seconds: a.metadata.durationSeconds ?? undefined,
    channel_id: a.metadata.channelId ?? undefined,
    custom_message: a.metadata.customMessage ?? undefined,
   },
  })) ?? undefined,
 exempt_roles: rule.exemptRoles?.map((r) => r.id),
 exempt_channels: rule.exemptChannels?.map((c) => c.id),
});

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const getId = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getId();
 if (!id) {
  cmd.client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  cmd.client.util.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = getSetting(rule, fieldName as Parameters<typeof getSetting>[1]);

 const updatedSetting = await updateRule(rule, fieldName as Parameters<typeof updateRule>[1]);
 if (!updatedSetting) return;
 if ('message' in updatedSetting) {
  if (updatedSetting.message.includes('actions[BASE_TYPE_BAD_LENGTH]')) {
   cmd.client.util.errorCmd(
    cmd,
    language.slashCommands.settings.categories['denylist-rules'].actionsRequired,
    language,
   );
   return;
  }

  cmd.client.util.errorCmd(cmd, updatedSetting, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  oldSetting as never,
  getSetting(rule, fieldName as Parameters<typeof getSetting>[1]) as never,
  '*' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedSetting, language);
};

enum SettingNames {
 Active = 'active',
 Profanity = 'profanity',
 SexualContent = 'sexualContent',
 Slurs = 'slurs',
 MentionRaidProtectionEnabled = 'mentionRaidProtectionEnabled',
 BlockMessage = 'blockMessage',
 SendAlertMessage = 'sendAlertMessage',
 Timeout = 'timeout',
}

const getSetting = (rule: Discord.AutoModerationRule, type: SettingNames) => {
 switch (type) {
  case SettingNames.Active:
   return !!rule.enabled;
  case SettingNames.Profanity:
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.Profanity,
   );
  case SettingNames.SexualContent:
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.SexualContent,
   );
  case SettingNames.Slurs:
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.Slurs,
   );
  case SettingNames.MentionRaidProtectionEnabled:
   return !!rule.triggerMetadata.mentionRaidProtectionEnabled;
  case SettingNames.BlockMessage:
   return rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)
    ? (JSON.parse(
       JSON.stringify(
        rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage),
       ),
      ) as Discord.AutoModerationAction)
    : undefined;
  case SettingNames.SendAlertMessage:
   return rule.actions.find((a) => a.type === Discord.AutoModerationActionType.SendAlertMessage)
    ? (JSON.parse(
       JSON.stringify(
        rule.actions.find((a) => a.type === Discord.AutoModerationActionType.SendAlertMessage),
       ),
      ) as Discord.AutoModerationAction)
    : undefined;
  case SettingNames.Timeout:
   return rule.actions.find((a) => a.type === Discord.AutoModerationActionType.Timeout)
    ? (JSON.parse(
       JSON.stringify(
        rule.actions.find((a) => a.type === Discord.AutoModerationActionType.Timeout),
       ),
      ) as Discord.AutoModerationAction)
    : undefined;
  default:
   return undefined;
 }
};

const updateRule = async (rule: Discord.AutoModerationRule, type: SettingNames) => {
 switch (type) {
  case SettingNames.Active: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    enabled: !rule.enabled,
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.Profanity: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: getAPIRule(rule) && {
     presets: rule.triggerMetadata.presets.includes(
      Discord.AutoModerationRuleKeywordPresetType.Profanity,
     )
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.Profanity,
        )
      : [...rule.triggerMetadata.presets, Discord.AutoModerationRuleKeywordPresetType.Profanity],
    },
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.SexualContent: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: getAPIRule(rule) && {
     presets: rule.triggerMetadata.presets.includes(
      Discord.AutoModerationRuleKeywordPresetType.SexualContent,
     )
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.SexualContent,
        )
      : [
         ...rule.triggerMetadata.presets,
         Discord.AutoModerationRuleKeywordPresetType.SexualContent,
        ],
    },
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.Slurs: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: getAPIRule(rule) && {
     presets: rule.triggerMetadata.presets.includes(
      Discord.AutoModerationRuleKeywordPresetType.Slurs,
     )
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.Slurs,
        )
      : [...rule.triggerMetadata.presets, Discord.AutoModerationRuleKeywordPresetType.Slurs],
    },
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.MentionRaidProtectionEnabled: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: getAPIRule(rule) && {
     mention_raid_protection_enabled: !rule.triggerMetadata.mentionRaidProtectionEnabled,
    },
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.BlockMessage: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    actions: getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.BlockMessage,
    ),
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.SendAlertMessage: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    actions: getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage,
    ),
   });

   if ('message' in res) return res;
   return res;
  }
  case SettingNames.Timeout: {
   const res = await rule.client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    actions: getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.Timeout,
    ),
   });

   if ('message' in res) return res;
   return res;
  }
  default:
   return undefined;
 }
};
