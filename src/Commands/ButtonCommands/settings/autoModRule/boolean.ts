import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';

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

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.error(cmd.guild, new Error('Rule not found'));
  return;
 }

 const oldSetting = getSetting(rule, fieldName as CT.Argument<typeof getSetting, 1>);

 const language = await ch.languageSelector(cmd.guildId);
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

  ch.errorCmd(cmd, updatedSetting.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  oldSetting,
  getSetting(rule, fieldName as CT.Argument<typeof getSetting, 1>),
  fieldName,
  settingName,
  id,
 );

 const settingsFile = (await ch.settingsHelpers.getSettingsFile(
  settingName,
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
   return JSON.parse(
    JSON.stringify(
     rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage),
    ),
   ) as Discord.AutoModerationAction;
  case 'sendAlertMessage':
   return JSON.parse(
    JSON.stringify(
     rule.actions.find((a) => a.type === Discord.AutoModerationActionType.SendAlertMessage),
    ),
   ) as Discord.AutoModerationAction;
  case 'timeout':
   return JSON.parse(
    JSON.stringify(rule.actions.find((a) => a.type === Discord.AutoModerationActionType.Timeout)),
   ) as Discord.AutoModerationAction;
  default:
   return undefined;
 }
};

const updateRule = (
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
): Promise<Discord.DiscordAPIError | Discord.AutoModerationRule> | undefined => {
 switch (type) {
  case 'active':
   return rule.setEnabled(!rule.enabled).catch((e) => e as Discord.DiscordAPIError);
  case 'profanity':
   return rule
    .setPresets(
     rule.triggerMetadata.presets.includes(Discord.AutoModerationRuleKeywordPresetType.Profanity)
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.Profanity,
        )
      : [...rule.triggerMetadata.presets, Discord.AutoModerationRuleKeywordPresetType.Profanity],
    )
    .catch((e) => e as Discord.DiscordAPIError);
  case 'sexualContent':
   return rule
    .setPresets(
     rule.triggerMetadata.presets.includes(
      Discord.AutoModerationRuleKeywordPresetType.SexualContent,
     )
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.SexualContent,
        )
      : [
         ...rule.triggerMetadata.presets,
         Discord.AutoModerationRuleKeywordPresetType.SexualContent,
        ],
    )
    .catch((e) => e as Discord.DiscordAPIError);
  case 'slurs':
   return rule
    .setPresets(
     rule.triggerMetadata.presets.includes(Discord.AutoModerationRuleKeywordPresetType.Slurs)
      ? rule.triggerMetadata.presets.filter(
         (o) => o !== Discord.AutoModerationRuleKeywordPresetType.Slurs,
        )
      : [...rule.triggerMetadata.presets, Discord.AutoModerationRuleKeywordPresetType.Slurs],
    )
    .catch((e) => e as Discord.DiscordAPIError);
  case 'mentionRaidProtectionEnabled':
   return rule
    .setMentionRaidProtectionEnabled(!rule.triggerMetadata.mentionRaidProtectionEnabled)
    .catch((e) => e as Discord.DiscordAPIError);
  case 'blockMessage': {
   const index = rule.actions.findIndex(
    (a) => a.type === Discord.AutoModerationActionType.BlockMessage,
   );

   if (index === -1) {
    ch.error(rule.guild, new Error('Enable "Block Message" Button pressed'));
    return undefined;
   }

   return rule
    .setActions(
     rule.actions.filter((a) => a.type !== Discord.AutoModerationActionType.BlockMessage),
    )
    .catch((e) => e as Discord.DiscordAPIError);
  }
  case 'sendAlertMessage': {
   const index = rule.actions.findIndex(
    (a) => a.type === Discord.AutoModerationActionType.SendAlertMessage,
   );

   if (index === -1) {
    ch.error(rule.guild, new Error('Enable "Send Alert Message" Button pressed'));
    return undefined;
   }

   return rule
    .setActions(
     rule.actions.filter((a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage),
    )
    .catch((e) => e as Discord.DiscordAPIError);
  }
  case 'timeout': {
   const index = rule.actions.findIndex((a) => a.type === Discord.AutoModerationActionType.Timeout);

   if (index === -1) {
    ch.error(rule.guild, new Error('Enable "Timeout" Button pressed'));
    return undefined;
   }

   return rule
    .setActions(rule.actions.filter((a) => a.type !== Discord.AutoModerationActionType.Timeout))
    .catch((e) => e as Discord.DiscordAPIError);
  }
  default:
   return undefined;
 }
};
