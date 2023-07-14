import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';
import type * as CT from '../../../../Typings/CustomTypings';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await ch.languageSelector(cmd.guildId);
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

 if (!updatedSetting) return;
 if ('message' in updatedSetting) {
  ch.errorCmd(cmd, updatedSetting.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(oldSetting, newSetting, fieldName, settingName, id);

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
   return rule.setAllowList(newSetting).catch((e) => e as Discord.DiscordAPIError);
  case 'regex':
   return rule.setRegexPatterns(newSetting).catch((e) => e as Discord.DiscordAPIError);
  case 'keywordFilter':
   return rule.setKeywordFilter(newSetting).catch((e) => e as Discord.DiscordAPIError);
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
