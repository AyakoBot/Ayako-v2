import * as CT from '../../../Typings/CustomTypings.js';

/**
 * Returns a placeholder string based on the type of mentionable.
 * @param type - The type of mentionable.
 * @param language - The language object containing the placeholder strings.
 * @returns The placeholder string.
 */
export default (
 type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
 language: CT.Language,
) => {
 switch (type) {
  case 'channel':
  case 'channels': {
   return language.t.Channels;
  }
  case 'user':
  case 'users': {
   return language.t.Users;
  }
  case 'role':
  case 'roles': {
   return language.t.Roles;
  }
  default: {
   return language.t.Mentionables;
  }
 }
};
