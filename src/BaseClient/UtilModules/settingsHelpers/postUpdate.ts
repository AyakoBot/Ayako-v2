import * as Discord from 'discord.js';
import { glob } from 'glob';
import type * as S from '../../../Typings/Settings.js';

/**
 * Updates a setting and triggers a post-update action if necessary.
 * @param oldSetting The old value of the setting.
 * @param newSetting The new value of the setting.
 * @param changedSetting The field that was changed.
 * @param settingName The name of the setting.
 * @param guild The guild where the setting was changed.
 * @param uniquetimestamp A unique timestamp to identify the update.
 */
export default async <T extends keyof typeof S.SettingsName2TableName>(
 oldSetting: unknown,
 newSetting: unknown,
 changedSetting: keyof S.FieldName<T>,
 settingName: T,
 guild: Discord.Guild,
 uniquetimestamp: number | string | undefined,
) => {
 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SlashCommands/**/*`,
 );

 const file = files.find((f) =>
  f.endsWith(
   `/${
    guild.client.util.constants.commands.settings.basicSettings.includes(String(settingName))
     ? `${String(settingName)}/basic`
     : String(settingName)
   }.js`,
  ),
 );
 if (!file) return;

 const settingsFile = (await import(file)) as S.SettingsFile<typeof settingName>;

 settingsFile.postChange?.(
  oldSetting as never,
  newSetting as never,
  changedSetting as never,
  guild,
  uniquetimestamp,
 );
};
