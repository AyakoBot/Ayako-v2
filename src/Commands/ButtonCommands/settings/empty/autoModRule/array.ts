import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/blacklist-rules.js';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 args.shift();
 const fieldName = args.shift() as 'exemptChannels' | 'exemptRoles';

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

 const language = await ch.languageSelector(cmd.guildId);
 const rule = cmd.guild.autoModerationRules.cache.get(id);
 if (!rule) {
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 const oldSetting = structuredClone(
  fieldName === 'exemptChannels'
   ? rule.exemptChannels.map((o) => o.id)
   : rule.exemptRoles.map((o) => o.id),
 );
 const updatedRule = await (fieldName === 'exemptChannels'
  ? rule.setExemptChannels([])
  : rule.setExemptRoles([])
 ).catch((e) => e as Discord.DiscordAPIError);

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule.message, language);
  return;
 }

 ch.settingsHelpers.updateLog([], oldSetting, 'exemptChannels', 'blacklist-rules', id);

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
