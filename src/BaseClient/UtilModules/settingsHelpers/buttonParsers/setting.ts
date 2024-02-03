import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Creates a setting button component for the settings editor.
 * @param language - The language object containing translations.
 * @param setting - The current value of the setting.
 * @param name - The name of the field.
 * @param settingName - The name of the setting.
 * @param linkName - The name of the linked setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @returns A Discord API button component.
 */
export default <T extends keyof typeof S.SettingsName2TableName>(
 language: CT.Language,
 setting: string[] | string | boolean | null,
 name: keyof S.FieldName<T>,
 settingName: T,
 linkName: keyof typeof S.SettingsName2TableName,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: (
  (
   language.slashCommands.settings.categories[settingName as S.SettingNames]
    .fields as S.FieldName<T>
  )[name] as unknown as Record<string, string>
 ).name,
 style: setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger,
 custom_id: `settings/editors/settinglink_${String(name)}_${String(settingName)}_${String(
  linkName,
 )}_${uniquetimestamp}`,
 emoji: language.client.util.emotes.settings,
});
