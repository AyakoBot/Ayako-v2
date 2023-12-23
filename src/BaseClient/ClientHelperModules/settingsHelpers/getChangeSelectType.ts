import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export type ChangeSelectType =
 | CT.EditorTypes.Channel
 | CT.EditorTypes.Role
 | CT.EditorTypes.User
 | CT.EditorTypes.Mention
 | CT.EditorTypes.Channels
 | CT.EditorTypes.Roles
 | CT.EditorTypes.Users
 | CT.EditorTypes.Mentions;

/**
 * Returns the corresponding Discord ComponentType for the given select type.
 * @param type - The select type to get the ComponentType for.
 * @returns The corresponding Discord ComponentType for the given select type.
 */
export default (type: ChangeSelectType) => {
 switch (type) {
  case CT.EditorTypes.Channel:
  case CT.EditorTypes.Channels: {
   return Discord.ComponentType.ChannelSelect;
  }
  case CT.EditorTypes.User:
  case CT.EditorTypes.Users: {
   return Discord.ComponentType.UserSelect;
  }
  case CT.EditorTypes.Role:
  case CT.EditorTypes.Roles: {
   return Discord.ComponentType.RoleSelect;
  }
  default: {
   return Discord.ComponentType.MentionableSelect;
  }
 }
};
