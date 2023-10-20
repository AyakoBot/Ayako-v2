import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as CT from '../../../Typings/CustomTypings.js';
import constants, { TableNamesPrismaTranslation } from '../../Other/constants.js';

/**
 * Updates a setting and triggers a post-update action if necessary.
 * @param oldSetting The old value of the setting.
 * @param newSetting The new value of the setting.
 * @param changedSetting The field that was changed.
 * @param settingName The name of the setting.
 * @param guild The guild where the setting was changed.
 * @param uniquetimestamp A unique timestamp to identify the update.
 */
export default async <T extends keyof CT.SettingsNames>(
 oldSetting: unknown,
 newSetting: unknown,
 changedSetting: keyof CT.FieldName<T>,
 settingName: T,
 guild: Discord.Guild,
 uniquetimestamp: number | string | undefined,
) => {
 const files = await glob(`${process.cwd()}/Commands/SlashCommands/**/*`);

 const file = files.find((f) =>
  f.endsWith(
   `/${
    constants.commands.settings.basicSettings.includes(String(settingName))
     ? `${String(settingName)}/basic`
     : String(settingName)
   }.js`,
  ),
 );
 if (!file) return;

 const tableName = TableNamesPrismaTranslation[
  settingName as keyof typeof TableNamesPrismaTranslation
 ] as keyof CT.Language['slashCommands']['settings']['categories'];

 const settingsFile = (await import(file)) as CT.SettingsFile<typeof tableName>;

 settingsFile.postChange?.(
  oldSetting as never,
  newSetting as never,
  changedSetting as never,
  guild,
  uniquetimestamp,
 );
};
