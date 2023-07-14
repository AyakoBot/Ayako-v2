import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';

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

 const newSetting = field.value;

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

 const updatedSetting = await rule
  .setActions([
   ...rule.actions
    .filter((a) => a.type !== Discord.AutoModerationActionType.BlockMessage)
    .map((a) =>
     a.type === Discord.AutoModerationActionType.SendAlertMessage
      ? ({
         type: Discord.AutoModerationActionType.SendAlertMessage,
         metadata: { channel: a.metadata.channelId },
        } as Discord.AutoModerationActionOptions)
      : a,
    ),
   {
    type: Discord.AutoModerationActionType.BlockMessage,
    metadata: {
     customMessage: newSetting,
    },
   },
  ])
  .catch((e) => e as Discord.DiscordAPIError);

 if (!updatedSetting) return;
 if ('message' in updatedSetting) {
  ch.errorCmd(cmd, updatedSetting.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  rule.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage)?.metadata
   .customMessage || language.events.logs.automodRule.defaultMessage,
  newSetting,
  'customMessage',
  settingName,
  id,
 );

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
