import * as Discord from 'discord.js';
import ms from 'ms';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../SlashCommands/settings/moderation/blacklist-rules.js';
import CT from '../../../../Typings/CustomTypings.js';
import { getAPIRule } from '../../../ButtonCommands/settings/autoModRule/boolean.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 args.shift();

 const language = await ch.getLanguage(cmd.guildId);

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

 const updatedRule = await ch.request.guilds.editAutoModerationRule(rule.guild, rule.id, {
  actions: [
   ...getAPIRule(rule).actions.filter((a) => a.type !== Discord.AutoModerationActionType.Timeout),
   {
    type: Discord.AutoModerationActionType.Timeout,
    metadata: {
     duration_seconds: Number(newSetting),
    },
   },
  ],
 });

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(
  { timeoutDuration: currentSetting } as never,
  { timeoutDuration: updatedRule?.['timeoutDuration' as keyof typeof updatedRule] } as never,
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
