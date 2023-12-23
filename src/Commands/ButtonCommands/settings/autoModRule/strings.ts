import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift() as Parameters<typeof getCurrentSetting>[1];
 if (!fieldName) {
  ch.error(cmd.guild, new Error('No field name found'));
  return;
 }

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

 cmd.showModal(
  ch.settingsHelpers.changeHelpers.changeModal(
   language,
   settingName,
   fieldName,
   'autoModRule/strings',
   getCurrentSetting(rule, fieldName),
   false,
   id,
   fieldName === 'keywordFilter',
  ),
 );
};

const getCurrentSetting = (
 rule: Discord.AutoModerationRule,
 type: 'keywordFilter' | 'allowList' | 'regex',
) => {
 switch (type) {
  case 'keywordFilter':
   return rule.triggerMetadata.keywordFilter.join(', ') || undefined;
  case 'allowList':
   return rule.triggerMetadata.allowList.join(', ') || undefined;
  case 'regex':
   return rule.triggerMetadata.regexPatterns.join(', ') || undefined;
  default:
   ch.error(rule.guild, new Error(`Invalid type ${type}`));
   return undefined;
 }
};
