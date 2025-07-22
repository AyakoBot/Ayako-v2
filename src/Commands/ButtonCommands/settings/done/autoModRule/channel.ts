import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';
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

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedRule, language);
};
