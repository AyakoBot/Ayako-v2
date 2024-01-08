import * as Discord from 'discord.js';

/**
 * Returns the appropriate Discord button style based on the provided setting.
 * @param setting - The setting to determine the button style for.
 * @returns The appropriate Discord button style.
 */
export default (setting: boolean | string | string[] | null) => {
 if (typeof setting === 'boolean' || !setting) {
  return setting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger;
 }
 return setting?.length ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger;
};
