import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import { getAPIRule } from '../../../ButtonCommands/settings/autoModRule/boolean.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/denylist-rules.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const field = cmd.fields.fields.first();
 if (!field) {
  cmd.client.util.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 const newSetting = field.value;

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

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  cmd.client.util.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const updatedSetting = await cmd.client.util.request.guilds.editAutoModerationRule(
  rule.guild,
  rule.id,
  {
   actions: [
    ...getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.BlockMessage,
    ),
    {
     type: Discord.AutoModerationActionType.BlockMessage,
     metadata: {
      custom_message: newSetting,
     },
    },
   ],
  },
 );

 if ('message' in updatedSetting) {
  cmd.client.util.errorCmd(cmd, updatedSetting, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  {
   customMessage:
    rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)?.metadata
     .customMessage || language.events.logs.automodRule.defaultMessage,
  } as never,
  {
   customMessage:
    updatedSetting.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)
     ?.metadata.customMessage || language.events.logs.automodRule.defaultMessage,
  } as never,
  'customMessage' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 const settingsFile = (await cmd.client.util.settingsHelpers.getSettingsFile(
  settingName,
  cmd.guild,
 )) as unknown as typeof SettingsFile;
 if (!settingsFile) return;

 cmd.update({
  embeds: settingsFile.getEmbeds(
   cmd.client.util.settingsHelpers.embedParsers,
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
