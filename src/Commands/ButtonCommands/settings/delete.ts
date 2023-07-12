import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as keyof CT.TableNamesMap;
 if (!settingName) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;

 const uniquetimestamp = Number(args.shift());

 const oldSettings = await ch.query(
  `DELETE FROM ${tableName} WHERE guildid = $1 AND uniquetimestamp = $2 RETURNING *;`,
  [cmd.guildId, uniquetimestamp],
 );

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, tableName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 ch.settingsHelpers.updateLog(oldSettings, {}, '*', settingName, uniquetimestamp);
 settingsFile.showAll?.(cmd, language, lan);
};
