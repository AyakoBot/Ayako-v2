import type * as CT from '../../../Typings/Typings.js';
import type * as S from '../../../Typings/Settings.js';

/**
 * Returns the label for a given type of denylist/allowlist setting.
 * @param language - The language object containing the localized strings.
 * @param type - The type of denylist/allowlist setting to get the label for.
 * @returns The label for the given type of denylist/allowlist setting.
 */
export default (language: CT.Language, type: S.GlobalDescType) =>
 type && type !== language.client.util.CT.GlobalDescType.Active
  ? language.slashCommands.settings.BLWL[type]
  : language.slashCommands.settings.active;
