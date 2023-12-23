import { Prisma } from '@prisma/client';
import * as CT from '../../../Typings/Typings.js';
import emotes from '../emotes.js';

/**
 * Returns the corresponding emoji based on the setting and type.
 * @param setting - The setting to determine the emoji for.
 * @param type - The type of setting to determine the emoji for.
 * @returns The corresponding emoji for the setting and type.
 */
export default (
 setting: string | boolean | string[] | undefined | Prisma.Decimal | null,
 type?: CT.GlobalDescType,
) => {
 switch (type) {
  case CT.GlobalDescType.BLChannelId:
  case CT.GlobalDescType.WLChannelId:
   return emotes.channelTypes[0];
  case CT.GlobalDescType.BLRoleId:
  case CT.GlobalDescType.WLRoleId:
   return emotes.Role;
  case CT.GlobalDescType.BLUserId:
  case CT.GlobalDescType.WLUserId:
   return emotes.Member;
  default:
   return setting ? emotes.enabled : emotes.disabled;
 }
};
