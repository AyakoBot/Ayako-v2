import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Settings.js';

/**
 * A button component used for navigating back to the previous menu.
 * @param name - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @returns A Discord API button component.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 name: T,
 uniquetimestamp: number | undefined | string,
 client: Discord.Client,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: `settings/settingsDisplay_${String(name)}_${uniquetimestamp}`,
 emoji: client.util.emotes.back,
});
