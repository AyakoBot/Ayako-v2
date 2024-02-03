import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Creates a global button component for the settings editor.
 * @param language - The language object containing translations.
 * @param setting - The current value of the setting.
 * @param type - The type of setting.
 * @param settingName - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @returns A Discord API button component.
 */
export default (
 language: CT.Language,
 setting: boolean | string[] | null,
 type: S.GlobalDescType,
 settingName: string,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label:
  language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.getLable.file.default(
   language,
   type,
  ),
 style:
  language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.getStyle.file.default(
   setting,
  ),
 custom_id: `settings/editors/${language.client.util.CT.GlobalType[type]}_${type}_${settingName}_${uniquetimestamp}`,
 emoji:
  language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.getEmoji.file.default(
   setting,
   type,
  ),
});
