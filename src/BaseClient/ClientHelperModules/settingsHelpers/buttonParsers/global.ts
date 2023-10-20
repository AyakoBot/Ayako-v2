import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

import getLable from '../getLable.js';
import getStyle from '../getStyle.js';
import getGlobalType from '../getGlobalType.js';
import getEmoji from '../getEmoji.js';

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
 type: CT.BLWLType | 'active',
 settingName: string,
 uniquetimestamp: number | undefined,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: getLable(language, type),
 style: getStyle(setting),
 custom_id: `settings/editors/${getGlobalType(type)}_${type}_${settingName}_${uniquetimestamp}`,
 emoji: getEmoji(setting, type),
});
