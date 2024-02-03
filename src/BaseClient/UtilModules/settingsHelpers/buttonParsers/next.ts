import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Creates a button component for navigating to the next page of settings.
 * @param language - The language object containing translations.
 * @param name - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @param enabled - Whether the button should be enabled or disabled.
 * @returns A Discord API button component.
 */
export default <T extends keyof typeof S.SettingsName2TableName>(
 language: CT.Language,
 name: T,
 uniquetimestamp: number | undefined,
 enabled = false,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 label: language.slashCommands.settings.next,
 style: Discord.ButtonStyle.Success,
 custom_id: `settings/next_${String(name)}_${uniquetimestamp}`,
 emoji: language.client.util.emotes.forth,
 disabled: !enabled,
});
