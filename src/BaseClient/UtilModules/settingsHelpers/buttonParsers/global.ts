import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import getEmoji from '../getEmoji.js';
import getLable from '../getLable.js';
import getStyle from '../getStyle.js';
import { getWithUTS } from './back.js';

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
 type: CT.GlobalDescType,
 settingName: string,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: getLable(language, type),
 style: getStyle(setting),
 custom_id: getWithUTS(
  `settings/editors/${CT.GlobalType[type]}_${type}_${settingName}`,
  uniquetimestamp,
 ),
 emoji: getEmoji(setting, type),
});
