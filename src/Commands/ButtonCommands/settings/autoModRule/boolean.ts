import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';

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

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const getID = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getID();
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.getLanguage(cmd.guildId);
 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = getSetting(rule, fieldName as CT.Argument<typeof getSetting, 1>);

 const updatedSetting = await updateRule(rule, fieldName as CT.Argument<typeof updateRule, 1>);
 if (!updatedSetting) return;
 if ('message' in updatedSetting) {
  if (updatedSetting.message.includes('actions[BASE_TYPE_BAD_LENGTH]')) {
   ch.errorCmd(
    cmd,
    language.slashCommands.settings.categories['blacklist-rules'].actionsRequired,
    language,
   );
   return;
  }

  ch.errorCmd(cmd, updatedSetting, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  oldSetting as never,
  getSetting(rule, fieldName as CT.Argument<typeof getSetting, 1>) as never,
  '*' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 const settingsFile = (await ch.settingsHelpers.getSettingsFile(
  settingName,
  cmd.guild,
 )) as unknown as typeof SettingsFile;
 if (!settingsFile) return;

 cmd.update({
  embeds: settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: settingsFile.getComponents(
   updatedSetting,
   language,
   language.slashCommands.settings.categories['blacklist-rules'],
  ),
 });
};

const getSetting = (
 rule: Discord.AutoModerationRule,
 type:
  | 'active'
  | 'profanity'
  | 'sexualContent'
  | 'slurs'
  | 'mentionRaidProtectionEnabled'
  | 'blockMessage'
  | 'sendAlertMessage'
  | 'timeout',
) => {
 switch (type) {
  case 'active':
   return !!rule.enabled;
  case 'profanity':
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.Profanity,
   );
  case 'sexualContent':
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.SexualContent,
   );
  case 'slurs':
   return !!rule.triggerMetadata.presets.includes(
    Discord.AutoModerationRuleKeywordPresetType.Slurs,
   );
  case 'mentionRaidProtectionEnabled':
   return !!rule.triggerMetadata.mentionRaidProtectionEnabled;
  case 'blockMessage':
   return rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)
    ? (JSON.parse(
       JSON.stringify(
        rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage),
       ),
      ) as Discord.AutoModerationAction)
    : undefined;
  case 'sendAlertMessage':
   return rule.actions.find((a) => a.type === Discord.AutoModerationActionType.SendAlertMessage)
    ? (JSON.parse(
       JSON.stringify(
        rule.actions.find((a) => a.type === Discord.AutoModerationActionType.SendAlertMessage),
       ),
      ) as Discord.AutoModerationAction)
    : undefined;
  case 'timeout':
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

const updateRule = async (
 rule: Discord.AutoModerationRule,
 type:
  | 'active'
  | 'profanity'
  | 'sexualContent'
  | 'slurs'
  | 'mentionRaidProtectionEnabled'
  | 'blockMessage'
  | 'sendAlertMessage'
  | 'timeout',
) => {
 switch (type) {
  case 'active': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    enabled: !rule.enabled,
   });

   if ('message' in res) return res;
   return res;
  }
  case 'profanity': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
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
  case 'sexualContent': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
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
  case 'slurs': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
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
  case 'mentionRaidProtectionEnabled': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: getAPIRule(rule) && {
     mention_raid_protection_enabled: !rule.triggerMetadata.mentionRaidProtectionEnabled,
    },
   });

   if ('message' in res) return res;
   return res;
  }
  case 'blockMessage': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    actions: getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.BlockMessage,
    ),
   });

   if ('message' in res) return res;
   return res;
  }
  case 'sendAlertMessage': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    actions: getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage,
    ),
   });

   if ('message' in res) return res;
   return res;
  }
  case 'timeout': {
   const res = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
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
