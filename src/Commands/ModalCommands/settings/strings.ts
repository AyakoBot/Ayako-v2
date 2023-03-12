import type * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
  if (!cmd.isFromMessage()) return;

  const language = await ch.languageSelector(cmd.guildId);

  const field = cmd.fields.fields.last();
  if (!field) {
    ch.errorCmd(cmd, language.errors.numNaN, language);
    return;
  }

  const settingName = args.shift() as keyof CT.TableNamesMap;
  if (!settingName) return;

  const tableName = ch.constants.commands.settings.tableNames[
    settingName as keyof typeof ch.constants.commands.settings.tableNames
  ] as keyof CT.TableNamesMap;
  type SettingsType = CT.TableNamesMap[typeof tableName];

  const fieldName = field.customId;
  const newSetting = field.value.split(/#/g).map((v) => v.trim());

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

  const updatedSetting = (await ch.settingsHelpers.changeHelpers.getAndInsert(
    tableName,
    fieldName,
    cmd.guildId,
    newSetting,
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
    ),
  });
};
