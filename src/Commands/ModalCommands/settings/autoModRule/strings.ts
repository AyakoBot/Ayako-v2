import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import client from '../../../../BaseClient/Bot/Client.js';
import { getAPIRule } from '../../../ButtonCommands/settings/autoModRule/boolean.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await client.util.getLanguage(cmd.guildId);
 const field = cmd.fields.fields.first();
 if (!field) {
  client.util.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 const fieldName = field.customId as Parameters<typeof updateSetting>[1];

 const getId = () => {
  const arg = args.shift();
  if (arg) return arg;
  return undefined;
 };
 const id = getId();
 if (!id) {
  client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  client.util.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = String(getCurrentSetting(rule, fieldName));
 const newSetting = field.value.split(/,\s+/g).filter((s) => s.length);
 const updatedSetting = await updateSetting(rule, fieldName, newSetting);

 if (!updatedSetting || 'message' in updatedSetting) {
  client.util.errorCmd(cmd, updatedSetting || '', language);
  return;
 }

 client.util.settingsHelpers.updateLog(
  { [fieldName]: oldSetting } as never,
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] } as never,
  fieldName as Parameters<(typeof client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedSetting, language);
};

const updateSetting = (
 rule: Discord.AutoModerationRule,
 type: 'allowList' | 'keywordFilter' | 'regex',
 newSetting: string[],
) => {
 switch (type) {
  case 'allowList':
   return client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: {
     ...getAPIRule(rule).trigger_metadata,
     allow_list: newSetting,
    } as Discord.APIAutoModerationRuleTriggerMetadata,
   });
  case 'regex':
   return client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: {
     ...getAPIRule(rule).trigger_metadata,
     regex_patterns: newSetting,
    } as Discord.APIAutoModerationRuleTriggerMetadata,
   });
  case 'keywordFilter':
   return client.util.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
    trigger_metadata: {
     ...getAPIRule(rule).trigger_metadata,
     keyword_filter: newSetting,
    } as Discord.APIAutoModerationRuleTriggerMetadata,
   });
  default: {
   client.util.error(rule.guild, new Error(`Invalid type ${type}`));
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
   client.util.error(rule.guild, new Error(`Invalid type ${type}`));
   return undefined;
 }
};
