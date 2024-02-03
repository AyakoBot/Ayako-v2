import type * as CT from '../../../Typings/Typings.js';
import type * as S from '../../../Typings/Settings.js';

/**
 * Returns a placeholder string based on the type of mentionable.
 * @param type - The type of mentionable.
 * @param language - The language object containing the placeholder strings.
 * @returns The placeholder string.
 */
export default (type: S.EditorTypes, language: CT.Language) => {
 switch (type) {
  case language.client.util.CT.EditorTypes.Channel:
  case language.client.util.CT.EditorTypes.Channels:
   return language.t.Channels;
  case language.client.util.CT.EditorTypes.User:
  case language.client.util.CT.EditorTypes.Users:
   return language.t.Users;
  case language.client.util.CT.EditorTypes.Role:
  case language.client.util.CT.EditorTypes.Roles:
   return language.t.Roles;
  default:
   return language.t.Mentionables;
 }
};
