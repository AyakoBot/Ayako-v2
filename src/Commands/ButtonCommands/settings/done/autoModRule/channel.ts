import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/denylist-rules.js';
import { getAPIRule } from '../../autoModRule/boolean.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getId = () => {
  const arg = args.pop();
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

 const oldSetting = rule.actions.find(
  (a) => a.type === Discord.AutoModerationActionType.SendAlertMessage,
 )?.metadata.channelId;

 const channelText = cmd.message.embeds[0].description?.split(/,\s/g);
 const channelId = channelText
  ?.map((c) => c.replace(/\D/g, '') || undefined)
  .filter((c): c is string => !!c)?.[0];

 const updatedRule = await cmd.client.util.request.guilds.editAutoModerationRule(
  cmd.guild,
  rule.id,
  {
   actions: [
    ...getAPIRule(rule).actions.filter(
     (a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage,
    ),
    ...(channelId
     ? [
        {
         type: Discord.AutoModerationActionType.SendAlertMessage,
         metadata: {
          channel_id: channelId,
         },
        },
       ]
     : []),
   ] as Discord.APIAutoModerationAction[],
  },
 );

 if ('message' in updatedRule) {
  cmd.client.util.errorCmd(cmd, updatedRule, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  { alertChannel: oldSetting } as never,
  { alertChannel: channelId } as never,
  'alertChannel' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
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
   updatedRule,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: settingsFile.getComponents(
   updatedRule,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
 });
};
