import * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
  const settingName = args.shift() as keyof CT.TableNamesMap;
  if (!settingName) return;

  const fieldName = args.shift();
  if (!fieldName) return;

  const tableName = ch.constants.commands.settings.tableNames[
    settingName as keyof typeof ch.constants.commands.settings.tableNames
  ] as keyof CT.TableNamesMap;
  type SettingsType = CT.TableNamesMap[typeof tableName];

  const getUniquetimestamp = () => {
    const arg = args.shift();
    if (arg) return Number(arg);
    return undefined;
  };
  const uniquetimestamp = getUniquetimestamp();

  const currentSetting = (await ch.settingsHelpers.changeHelpers.get(
    tableName,
    fieldName,
    cmd.guildId,
    uniquetimestamp,
  )) as SettingsType;

  const language = await ch.languageSelector(cmd.guildId);
  const languageID = Object.entries(language.languages).find(
    (e) => e[1] === cmd.message.embeds[0].description,
  )?.[0];

  const updatedSetting = (await ch.settingsHelpers.changeHelpers.getAndInsert(
    tableName,
    fieldName,
    cmd.guildId,
    languageID,
    uniquetimestamp,
  )) as SettingsType;

  ch.settingsHelpers.updateLog(
    currentSetting,
    { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
    fieldName,
    settingName,
    uniquetimestamp,
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

  cmd.update({
    embeds: await settingsFile.getEmbeds(
      ch.settingsHelpers.embedParsers,
      updatedSetting,
      language,
      language.slashCommands.settings.categories[settingName],
    ),
    components: await settingsFile.getComponents(
      ch.settingsHelpers.buttonParsers,
      updatedSetting,
      language,
      settingName,
    ),
  });
};
