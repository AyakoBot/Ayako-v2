import * as CT from '../../../Typings/CustomTypings.js';

/**
 * Determines the global type based on the provided type.
 * @param type The type to determine the global type for.
 * @returns The global type as a string.
 */
export default (type: CT.BLWLType | 'active') => {
 switch (true) {
  case type.includes('channel'): {
   return 'channels';
  }
  case type.includes('role'): {
   return 'roles';
  }
  case type.includes('user'): {
   return 'users';
  }
  default: {
   return 'boolean';
  }
 }
};
