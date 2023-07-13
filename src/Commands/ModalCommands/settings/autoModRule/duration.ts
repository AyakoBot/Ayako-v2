import * as Discord from 'discord.js';
import ms from 'ms';
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
  ch.error(cmd.guild, new Error('Rule not found'));
  return;
 }

 const currentSetting = Number(
  rule.actions.find((a) => a.type === Discord.AutoModerationActionType.Timeout)?.metadata
   .durationSeconds,
 );

 const newActions = [
  ...rule.actions.filter((a) => a.type !== Discord.AutoModerationActionType.Timeout),
  {
   type: Discord.AutoModerationActionType.Timeout,
   metadata: {
    durationSeconds: Number(newSetting),
   },
  },
 ];

 console.log(newActions);

 const updatedSetting = await rule
  .setActions(newActions)
  .catch((e) => e as Discord.DiscordAPIError);

 if ('message' in updatedSetting) {
  ch.errorCmd(cmd, updatedSetting.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  currentSetting,
  Number(newSetting) / 1000,
  'timeoutDuration',
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
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
 });
};
