import { Prisma } from '@prisma/client';
import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import constants from '../../../Other/constants.js';

import getEmoji from '../getEmoji.js';

/**
 * Creates a specific button component for the settings editor.
 * @param language - The language object containing translations.
 * @param setting - The current value of the setting.
 * @param name - The name of the field.
 * @param settingName - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @param type - The type of setting.
 * @param emoji - The emoji to use for the button component.
 * @returns A Discord API button component.
 */
export default <T extends keyof CT.Categories>(
 language: CT.Language,
 setting: string[] | string | boolean | null | Prisma.Decimal,
 name: keyof CT.FieldName<T>,
 settingName: T,
 uniquetimestamp: number | undefined,
 type?: CT.EditorTypes.Channel | CT.EditorTypes.Role | CT.EditorTypes.User,
 emoji?: Discord.APIMessageComponentEmoji,
): Discord.APIButtonComponent => {
 const constantTypes =
  constants.commands.settings.types[settingName as keyof typeof constants.commands.settings.types];

 if (!constantTypes) {
  throw new Error(
   `Constants for ${String(settingName)} missing at constants.commands.settings.types[]`,
  );
 }

 return {
  type: Discord.ComponentType.Button,
  label: (
   (
    language.slashCommands.settings.categories[settingName as CT.SettingNames]
     .fields as CT.FieldName<T>
   )[name] as unknown as Record<string, string>
  ).name,
  style:
   (typeof setting !== 'boolean' && setting && String(setting).length) || !!setting
    ? Discord.ButtonStyle.Primary
    : Discord.ButtonStyle.Danger,
  custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
   name,
  )}_${String(settingName)}_${uniquetimestamp}`,
  emoji: (type ? getEmoji(setting, `wl${type}id` as CT.GlobalDescType) : undefined) ?? emoji,
 };
};
