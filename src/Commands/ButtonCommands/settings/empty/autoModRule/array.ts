import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 args.shift();
 const fieldName = args.shift() as 'exemptChannels' | 'exemptRoles';

 const getId = () => {
  const arg = args.shift();
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

 const oldSetting = structuredClone(
  fieldName === 'exemptChannels'
   ? rule.exemptChannels.map((o) => o.id)
   : rule.exemptRoles.map((o) => o.id),
 );
 const updatedRule = await (
  fieldName === 'exemptChannels'
   ? cmd.client.util.request.guilds.editAutoModerationRule(
      cmd.guild,
      rule.id,
      { exempt_channels: [] },
      cmd.user.username,
     )
   : cmd.client.util.request.guilds.editAutoModerationRule(
      cmd.guild,
      rule.id,
      { exempt_roles: [] },
      cmd.user.username,
     )
 ).catch((e) => e as Discord.DiscordAPIError);

 if ('message' in updatedRule) {
  cmd.client.util.errorCmd(cmd, updatedRule, language);
  return;
 }

 cmd.client.util.settingsHelpers.updateLog(
  { exemptChannels: oldSetting } as never,
  { exemptChannels: rule?.[fieldName as keyof typeof rule] } as never,
  fieldName as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, updatedRule, language);
};
