import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';
import * as SettingsFile from '../../../../SlashCommands/settings/moderation/denylist-rules.js';

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

 const oldSetting = structuredClone(rule.exemptRoles.map((o) => o.id));
 const roleText = cmd.message.embeds[0].description?.split(/,\s/g);
 const roleIds =
  roleText?.map((c) => c.replace(/\D/g, '') || undefined).filter((r): r is string => !!r) ?? [];
 const updatedRule = await cmd.client.util.request.guilds.editAutoModerationRule(
  cmd.guild,
  rule.id,
  {
   exempt_roles: roleIds,
  },
 );

 if ('message' in updatedRule) {
  cmd.client.util.errorCmd(cmd, updatedRule, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  { exemptRoles: oldSetting } as never,
  { exemptRoles: roleIds } as never,
  'exemptRoles' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
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
