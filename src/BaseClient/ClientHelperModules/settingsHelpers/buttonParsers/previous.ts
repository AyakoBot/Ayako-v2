import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import emotes from '../../emotes.js';

/**
 * Creates a button component for navigating to the previous page of settings.
 * @param language - The language object containing translations.
 * @param name - The name of the setting.
 * @param enabled - Whether the button should be enabled or disabled.
 * @returns A Discord API button component.
 */
export default <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 name: T,
 enabled = false,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: language.slashCommands.settings.previous,
 style: Discord.ButtonStyle.Success,
 custom_id: `settings/previous_${String(name)}`,
 emoji: emotes.back,
 disabled: !enabled,
});
