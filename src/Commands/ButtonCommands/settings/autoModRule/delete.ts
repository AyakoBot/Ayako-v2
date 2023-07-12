import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

const settingName = 'blacklist-rules';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;

 const id = args.shift();
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.languageSelector(cmd.guildId);
 const oldSettings = JSON.parse(JSON.stringify(cmd.guild.autoModerationRules.cache.get(id)));
 const error = await cmd.guild.autoModerationRules.cache
  .get(id)
  ?.delete()
  .catch((e) => e as Discord.DiscordAPIError);

 if (error) {
  ch.errorCmd(cmd, error.message, language);
  return;
 }

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, tableName, cmd.guild);
 if (!settingsFile) {
  ch.error(cmd.guild, new Error('SettingsFile not found'));
  return;
 }

 const lan = language.slashCommands.settings.categories[settingName];

 ch.settingsHelpers.updateLog(oldSettings, {}, '*', settingName, id);
 settingsFile.showAll?.(cmd, language, lan);
};
