import * as Discord from 'discord.js';
import type * as S from '../../../Typings/Settings.js';
import client from '../../Bot/Client.js';

export type ChangeSelectType =
 | S.EditorTypes.Channel
 | S.EditorTypes.Role
 | S.EditorTypes.User
 | S.EditorTypes.Mention
 | S.EditorTypes.Channels
 | S.EditorTypes.Roles
 | S.EditorTypes.Users
 | S.EditorTypes.Mentions;

/**
 * Returns the corresponding Discord ComponentType for the given select type.
 * @param type - The select type to get the ComponentType for.
 * @returns The corresponding Discord ComponentType for the given select type.
 */
export default (type: ChangeSelectType) => {
 switch (type) {
  case client.util.CT.EditorTypes.Channel:
  case client.util.CT.EditorTypes.Channels:
   return Discord.ComponentType.ChannelSelect;
  case client.util.CT.EditorTypes.User:
  case client.util.CT.EditorTypes.Users:
   return Discord.ComponentType.UserSelect;
  case client.util.CT.EditorTypes.Role:
  case client.util.CT.EditorTypes.Roles:
   return Discord.ComponentType.RoleSelect;
  default:
   return Discord.ComponentType.MentionableSelect;
 }
};
