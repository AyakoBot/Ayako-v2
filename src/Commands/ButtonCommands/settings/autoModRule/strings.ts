import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift() as Parameters<typeof getCurrentSetting>[1];
 if (!fieldName) {
  cmd.client.util.error(cmd.guild, new Error('No field name found'));
  return;
 }

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

 cmd.showModal(
  cmd.client.util.settingsHelpers.changeHelpers.changeModal(
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
   rule.client.util.error(rule.guild, new Error(`Invalid type ${type}`));
   return undefined;
 }
};
