import * as CT from '../../../Typings/CustomTypings.js';

/**
 * Returns the label for a given type of denylist/allowlist setting.
 * @param language - The language object containing the localized strings.
 * @param type - The type of denylist/allowlist setting to get the label for.
 * @returns The label for the given type of denylist/allowlist setting.
 */
export default (language: CT.Language, type: CT.BLWLType | 'active') => {
 if (type && type !== 'active') {
  return language.slashCommands.settings[
   type.slice(0, -2) as 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser'
  ];
 }
 return language.slashCommands.settings.active;
};
