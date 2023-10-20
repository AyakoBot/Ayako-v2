import * as Discord from 'discord.js';

/**
 * Returns the corresponding Discord ComponentType for the given select type.
 * @param type - The select type to get the ComponentType for.
 * @returns The corresponding Discord ComponentType for the given select type.
 */
export default (
 type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
) => {
 switch (type) {
  case 'channel':
  case 'channels': {
   return Discord.ComponentType.ChannelSelect;
  }
  case 'user':
  case 'users': {
   return Discord.ComponentType.UserSelect;
  }
  case 'role':
  case 'roles': {
   return Discord.ComponentType.RoleSelect;
  }
  default: {
   return Discord.ComponentType.MentionableSelect;
  }
 }
};
