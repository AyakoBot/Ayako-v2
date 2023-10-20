import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import emotes from '../../emotes.js';

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
export default <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 setting: string[] | string | boolean | null,
 name: keyof CT.FieldName<T>,
 settingName: T,
 linkName: keyof CT.SettingsNames,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: (
  (
   language.slashCommands.settings.categories[
    settingName as keyof CT.Language['slashCommands']['settings']['categories']
   ].fields as CT.FieldName<T>
  )[name] as unknown as Record<string, string>
 ).name,
 style: setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger,
 custom_id: `settings/editors/settinglink_${String(name)}_${String(settingName)}_${String(
  linkName,
 )}_${uniquetimestamp}`,
 emoji: emotes.settings,
});
