import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/blacklist-rules.js';

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

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.error(cmd.guild, new Error('Rule not found'));
  return;
 }

 const oldSetting = rule.actions.find(
  (a) => a.type === Discord.AutoModerationActionType.SendAlertMessage,
 )?.metadata.channelId;

 const channelText = cmd.message.embeds[0].description?.split(/,\s/g);
 const channelID = channelText
  ?.map((c) => c.replace(/\D/g, '') || undefined)
  .filter((c): c is string => !!c)?.[0];

 const updatedRule = await rule
  .setActions([
   ...rule.actions
    .filter((a) => a.type !== Discord.AutoModerationActionType.SendAlertMessage)
    .map((a) =>
     a.type === Discord.AutoModerationActionType.SendAlertMessage
      ? ({
         type: Discord.AutoModerationActionType.SendAlertMessage,
         metadata: { channel: a.metadata.channelId },
        } as Discord.AutoModerationActionOptions)
      : a,
    ),
   ...(channelID
    ? [
       {
        type: Discord.AutoModerationActionType.SendAlertMessage,
        metadata: {
         channel: channelID,
        },
       },
      ]
    : []),
  ])
  .catch((e) => e as Discord.DiscordAPIError);

 const language = await ch.languageSelector(cmd.guildId);

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(channelID, oldSetting, 'alertChannel', 'blacklist-rules', id);

 const settingsFile = (await ch.settingsHelpers.getSettingsFile(
  settingName,
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
