import * as Discord from 'discord.js';
import ms from 'ms';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';
import CT from '../../../../Typings/CustomTypings.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await ch.languageSelector(cmd.guildId);

 const field = cmd.fields.fields.first();
 if (!field) {
  ch.errorCmd(cmd, language.errors.numNaN, language);
  return;
 }

 const verify = (): Promise<{ value?: number; error?: Error }> =>
  new Promise((res) => {
   try {
    ms(field.value);
    res({ value: ch.getDuration(field.value) / 1000 });
   } catch (e) {
    res({ error: e as Error });
   }
  });
 const { value: newSetting, error } = await verify();

 if (error) {
  ch.errorCmd(cmd, error.message, language);
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

 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const currentSetting = Number(
  rule.actions.find((a) => a.type === Discord.AutoModerationActionType.Timeout)?.metadata
   .durationSeconds,
 );

 const updatedSetting = await rule
  .setActions([
   ...rule.actions
    .filter((a) => a.type !== Discord.AutoModerationActionType.Timeout)
    .map((a) =>
     a.type === Discord.AutoModerationActionType.SendAlertMessage
      ? ({
         type: Discord.AutoModerationActionType.SendAlertMessage,
         metadata: { channel: a.metadata.channelId },
        } as Discord.AutoModerationActionOptions)
      : a,
    ),
   {
    type: Discord.AutoModerationActionType.Timeout,
    metadata: {
     durationSeconds: Number(newSetting),
    },
   },
  ])
  .catch((e) => e as Discord.DiscordAPIError);

 if ('message' in updatedSetting) {
  ch.errorCmd(cmd, updatedSetting.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  { timeoutDuration: currentSetting } as never,
  { timeoutDuration: updatedSetting?.['timeoutDuration' as keyof typeof updatedSetting] } as never,
  'timeoutDuration' as CT.Argument<(typeof ch)['settingsHelpers']['updateLog'], 2>,
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
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: settingsFile.getComponents(
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
 });
};
