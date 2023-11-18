import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/blacklist-rules.js';
import * as CT from '../../../../../Typings/CustomTypings.js';
import { getAPIRule } from '../../autoModRule/boolean.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const getID = () => {
  const arg = args.pop();
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
  ch.errorCmd(cmd, language.t.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = rule.actions.find(
  (a) => a.type === Discord.AutoModerationActionType.SendAlertMessage,
 )?.metadata.channelId;

 const channelText = cmd.message.embeds[0].description?.split(/,\s/g);
 const channelID = channelText
  ?.map((c) => c.replace(/\D/g, '') || undefined)
  .filter((c): c is string => !!c)?.[0];

 const updatedRule = await ch.request.guilds.editAutoModerationRule(cmd.guild, rule.id, {
  actions: [
   ...getAPIRule(rule).actions.filter(
    (a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage,
   ),
   ...(channelID
    ? [
       {
        type: Discord.AutoModerationActionType.SendAlertMessage,
        metadata: {
         channel_id: channelID,
        },
       },
      ]
    : []),
  ] as Discord.APIAutoModerationAction[],
 });

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  { alertChannel: oldSetting } as never,
  { alertChannel: channelID } as never,
  'alertChannel' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
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
