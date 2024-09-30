import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.shift();
 if (!id) {
  cmd.client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const oldSettings = JSON.parse(JSON.stringify(cmd.guild.autoModerationRules.cache.get(id)));
 const res = await cmd.client.util.request.guilds.deleteAutoModerationRule(
  cmd.guild,
  id,
  cmd.user.username,
 );

 if (typeof res !== 'undefined') {
  cmd.client.util.errorCmd(cmd, res, language);
  return;
 }

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) {
  cmd.client.util.error(cmd.guild, new Error('SettingsFile not found'));
  return;
 }

 const lan = language.slashCommands.settings.categories[settingName as CT.SettingNames];

 cmd.client.util.settingsHelpers.updateLog(
  oldSettings as never,
  undefined,
  '*' as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  id,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 settingsFile.showAll?.(cmd, language, lan as never, 0);
};
