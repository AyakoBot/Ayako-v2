import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default <T extends keyof CT.SettingsNames>(
 fieldName: string,
 settingName: T,
 type: string,
 options: {
  options: Discord.StringSelectMenuComponent['options'];
  placeholder?: string;
  max_values?: number;
  min_values?: number;
  disabled?: boolean;
 },
 uniquetimestamp: number | undefined,
) => {
 const menu: Discord.APIStringSelectComponent = {
  min_values: options.min_values || 1,
  max_values: options.max_values || 1,
  custom_id: `settings/${type}_${fieldName}_${String(settingName)}${
   uniquetimestamp ? `_${uniquetimestamp}` : ''
  }`,
  type: Discord.ComponentType.StringSelect,
  options: (options.options.length ? options.options : [{ label: '-', value: '-' }]) ?? [
   { label: '-', value: '-' },
  ],
  placeholder: options.placeholder,
  disabled: options.disabled || !options.options.length,
 };

 return menu;
};
