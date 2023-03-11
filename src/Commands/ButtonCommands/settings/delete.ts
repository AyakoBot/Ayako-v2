import type * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
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

  const files: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Commands/SlashCommands/settings/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  const file = files.find((f) =>
    f.endsWith(
      `/${
        ch.constants.commands.settings.basicSettings.includes(settingName)
          ? `${settingName}/basic`
          : settingName
      }.js`,
    ),
  );
  if (!file) return;

  const settingsFile = (await import(file)) as CT.SettingsFile<typeof tableName>;
  const language = await ch.languageSelector(cmd.guildId);
  const lan = language.slashCommands.settings.categories[settingName];

  ch.settingsHelpers.updateLog(oldSettings, {}, '*', settingName, uniquetimestamp);
  settingsFile.showAll?.(cmd, language, lan);
};
