import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Creates a button component for creating a new setting.
 * @param language - The language object containing translations.
 * @param name - The name of the setting.
 * @returns A Discord API button component with a custom ID.
 */
export default <T extends keyof typeof S.SettingsName2TableName>(
 language: CT.Language,
 name: T,
): Discord.APIButtonComponentWithCustomId => ({
 type: Discord.ComponentType.Button,
 label: language.slashCommands.settings.create,
 style: Discord.ButtonStyle.Success,
 custom_id: `settings/create_${String(name)}`,
 emoji: language.client.util.emotes.plusBG,
});
