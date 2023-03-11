import type * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
  const settingName = args.shift() as keyof CT.TableNamesMap;
  if (!settingName) return;

  const tableName = ch.constants.commands.settings.tableNames[
    settingName as keyof typeof ch.constants.commands.settings.tableNames
  ] as keyof CT.TableNamesMap;
  type SettingsType = CT.TableNamesMap[typeof tableName];

  const settings = (await ch.settingsHelpers.changeHelpers.get(
    tableName,
    '*',
    cmd.guildId,
  )) as SettingsType;

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

  cmd.update({
    embeds: await settingsFile.getEmbeds(
      ch.settingsHelpers.embedParsers,
      settings,
      language,
      language.slashCommands.settings.categories[settingName],
    ),
    components: await settingsFile.getComponents(
      ch.settingsHelpers.buttonParsers,
      settings,
      language,
      settingName,
    ),
  });
};
