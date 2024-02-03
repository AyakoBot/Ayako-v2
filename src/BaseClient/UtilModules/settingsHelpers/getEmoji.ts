import { Prisma } from '@prisma/client';
import type * as S from '../../../Typings/Settings.js';
import client from '../../Bot/Client.js';

/**
 * Returns the corresponding emoji based on the setting and type.
 * @param setting - The setting to determine the emoji for.
 * @param type - The type of setting to determine the emoji for.
 * @returns The corresponding emoji for the setting and type.
 */
export default (
 setting: string | boolean | string[] | undefined | Prisma.Decimal | null,
 type?: S.GlobalDescType,
) => {
 switch (type) {
  case client.util.CT.GlobalDescType.BLChannelId:
  case client.util.CT.GlobalDescType.WLChannelId:
   return client.util.emotes.channelTypes[0];
  case client.util.CT.GlobalDescType.BLRoleId:
  case client.util.CT.GlobalDescType.WLRoleId:
   return client.util.emotes.Role;
  case client.util.CT.GlobalDescType.BLUserId:
  case client.util.CT.GlobalDescType.WLUserId:
   return client.util.emotes.Member;
  default:
   return setting ? client.util.emotes.enabled : client.util.emotes.disabled;
 }
};
