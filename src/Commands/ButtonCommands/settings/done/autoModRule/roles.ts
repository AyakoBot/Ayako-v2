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

 const oldSetting = structuredClone(rule.exemptRoles.map((o) => o.id));
 const roleText = cmd.message.embeds[0].description?.split(/,\s/g);
 const roleIDs =
  roleText?.map((c) => c.replace(/\D/g, '') || undefined).filter((r): r is string => !!r) ?? [];
 const updatedRule = await rule.setExemptRoles(roleIDs).catch((e) => e as Discord.DiscordAPIError);
 const language = await ch.languageSelector(cmd.guildId);

 if ('message' in updatedRule) {
  ch.errorCmd(cmd, updatedRule.message, language);
  return;
 }

 ch.settingsHelpers.updateLog(roleIDs, oldSetting, 'exemptRoles', 'blacklist-rules', id);

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
