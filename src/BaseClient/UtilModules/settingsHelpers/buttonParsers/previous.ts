import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import emotes from '../../emotes.js';

/**
 * Creates a button component for navigating to the previous page of settings.
 * @param language - The language object containing translations.
 * @param name - The name of the setting.
 * @param enabled - Whether the button should be enabled or disabled.
 * @returns A Discord API button component.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 language: CT.Language,
 name: T,
 page: number = 0,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: language.slashCommands.settings.previous,
 style: Discord.ButtonStyle.Secondary,
 custom_id: `settings/previous_${String(name)}_${page - 1}`,
 emoji: emotes.back,
 disabled: page === 0,
});
