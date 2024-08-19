import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import emotes from '../../emotes.js';

type UTS = number | undefined | string;

/**
 * A button component used for navigating back to the previous menu.
 * @param name - The name of the setting.
 * @param uniquetimestamp - A unique timestamp used to identify the button component.
 * @returns A Discord API button component.
 */
export default <T extends keyof typeof CT.SettingsName2TableName>(
 name: T,
 uniquetimestamp: UTS,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: getWithUTS(`settings/settingsDisplay_${String(name)}`, uniquetimestamp),
 emoji: emotes.back,
});

export const getWithUTS = (main: string, uts: UTS) =>
 `${main}${uts && !Number.isNaN(+uts) ? `_${uts}` : ''}`;
