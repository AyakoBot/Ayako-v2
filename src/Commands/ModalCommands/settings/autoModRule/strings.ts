import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/denylist-rules.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { getAPIRule } from '../../../ButtonCommands/settings/autoModRule/boolean.js';

const settingName = 'denylist-rules';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await ch.getLanguage(cmd.guildId);
 const field = cmd.fields.fields.first();
 if (!field) {
  ch.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 const fieldName = field.customId as CT.Argument<typeof updateSetting, 1>;

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
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = String(getCurrentSetting(rule, fieldName));
 const newSetting = field.value.split(/,\s+/g).filter((s) => s.length);
 const updatedSetting = await updateSetting(rule, fieldName, newSetting);

 if (!updatedSetting || 'message' in updatedSetting) {
  ch.errorCmd(cmd, updatedSetting || '', language);
  return;
 }

 ch.settingsHelpers.updateLog(
  { [fieldName]: oldSetting } as never,
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] } as never,
  fieldName as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
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
   rule,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
 });
};

const updateSetting = (
 rule: Discord.AutoModerationRule,
 type: 'allowList' | 'keywordFilter' | 'regex',
 newSetting: string[],
) => {
 switch (type) {
  case 'allowList':
   return ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: { ...getAPIRule(rule).trigger_metadata, allow_list: newSetting },
   });
  case 'regex':
   return ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: { ...getAPIRule(rule).trigger_metadata, regex_patterns: newSetting },
   });
  case 'keywordFilter':
   return ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: { ...getAPIRule(rule).trigger_metadata, keyword_filter: newSetting },
   });
  default: {
   ch.error(rule.guild, new Error(`Invalid type ${type}`));
   return undefined;
  }
 }
};

const getCurrentSetting = (
 rule: Discord.AutoModerationRule,
 type: 'keywordFilter' | 'allowList' | 'regex',
) => {
 switch (type) {
  case 'keywordFilter':
   return rule.triggerMetadata.keywordFilter;
  case 'allowList':
   return rule.triggerMetadata.allowList;
  case 'regex':
   return rule.triggerMetadata.regexPatterns;
  default:
   ch.error(rule.guild, new Error(`Invalid type ${type}`));
   return undefined;
 }
};
