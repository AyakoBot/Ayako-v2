import { Prisma } from '@prisma/client';
import * as CT from '../../../Typings/CustomTypings.js';
import emotes from '../emotes.js';

/**
 * Returns the corresponding emoji based on the setting and type.
 * @param setting - The setting to determine the emoji for.
 * @param type - The type of setting to determine the emoji for.
 * @returns The corresponding emoji for the setting and type.
 */
export default (
 setting: string | boolean | string[] | undefined | Prisma.Decimal | null,
 type?: CT.BLWLType | 'active',
) => {
 switch (type) {
  case 'blchannelid':
  case 'wlchannelid': {
   return emotes.channelTypes[0];
  }
  case 'blroleid':
  case 'wlroleid': {
   return emotes.Role;
  }
  case 'bluserid':
  case 'wluserid': {
   return emotes.Member;
  }
  default: {
   return setting ? emotes.enabled : emotes.disabled;
  }
 }
};
