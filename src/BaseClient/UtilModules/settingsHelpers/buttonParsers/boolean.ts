import * as Discord from 'discord.js';
import type * as S from '../../../../Typings/Settings.js';
import type * as CT from '../../../../Typings/Typings.js';

/**
 * Creates a boolean button component for the settings editor.
 * @param language - The language object containing translations.
 * @param setting - The current value of the setting.
 * @param name - The name of the field.
 * @param settingName - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @returns A Discord API button component.
 */
export default <T extends keyof S.Categories>(
 language: CT.Language,
 setting: boolean | undefined,
 name: keyof S.FieldName<T>,
 settingName: T,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => {
 const constantTypes =
  language.client.util.constants.commands.settings.types[
   settingName as keyof typeof language.client.util.constants.commands.settings.types
  ];

 return {
  type: Discord.ComponentType.Button,
  label: (
   (
    language.slashCommands.settings.categories[settingName as S.SettingNames]
     .fields as S.FieldName<T>
   )[name] as unknown as Record<'name', string>
  ).name,
  style: setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger,
  custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
   name,
  )}_${String(settingName)}_${uniquetimestamp}`,
  emoji: setting ? language.client.util.emotes.enabled : language.client.util.emotes.disabled,
 };
};
