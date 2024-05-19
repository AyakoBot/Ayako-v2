import Prisma from '@prisma/client';
import DataBase from '../Bot/DataBase.js';
import { PunishmentType } from '../../Typings/Typings.js';

type Picked = 'userid' | 'uniquetimestamp' | 'executorid' | 'guildid';

export type Returned = (
 | Prisma.punish_bans
 | Prisma.punish_channelbans
 | Prisma.punish_kicks
 | Prisma.punish_mutes
 | Prisma.punish_warns
) & {
 type: PunishmentType;
};

function f(id: number): Promise<Returned | null>;
function f(id: string): Promise<Returned | null>;
function f(
 id: number,
 options: {
  includeTemp?: boolean;
  identType: 'between';
  ident: number;
  guildid: string;
 },
): Promise<Returned[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'by';
  ident: string;
  guildid: string;
 },
): Promise<Returned[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'with-type';
  ident: Parameters<typeof getWithType>[1];
  guildid: string;
 },
): Promise<Returned[] | null>;
function f(
 id: number,
 options: {
  includeTemp?: boolean;
  identType: 'after' | 'before';
  guildid: string;
 },
): Promise<Returned[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'all-by' | 'all-on';
  guildid: string;
 },
): Promise<Returned[] | null>;
/**
 * Retrieves punishment data from the database based on the given parameters.
 * @param id - The ID of the user to retrieve punishment data for.
 * @param identType - The type of identification to use when retrieving punishment data.
 * @param ident - The identification value to use when retrieving punishment data.
 * @returns A Promise that resolves to an array of punishment data objects,
 * a single punishment data object, or null if no punishment data is found.
 */
async function f(
 id: number | string,
 options?: {
  includeTemp?: boolean;
  identType?: 'after' | 'before' | 'between' | 'by' | 'all-on' | 'all-by' | 'with-type';
  ident?: string | number;
  guildid?: string;
 },
): Promise<Returned | Returned[] | Returned[] | null> {
 let asArray = true;

 if (options?.identType === 'with-type') {
  return getWithType(
   id as string,
   options.ident as Parameters<typeof getWithType>[1],
   options.includeTemp ?? false,
   options.guildid as string,
  ) as ReturnType<typeof f>;
 }

 const where: {
  where: Pick<Prisma.Prisma.punish_warnsWhereInput, Picked>;
 } = (() => {
  switch (options?.identType) {
   case 'all-on':
    return { where: { userid: String(id), guildid: String(options.guildid) } };
   case 'by':
    return {
     where: {
      userid: String(id),
      executorid: String(options.ident),
      guildid: String(options.guildid),
     },
    };
   case 'all-by':
    return { where: { executorid: String(id), guildid: String(options.guildid) } };
   case 'between':
    return {
     where: {
      uniquetimestamp: {
       lt: String([id, options.ident].sort((a, b) => Number(b) - Number(a))[0]),
       gt: String([id, options.ident].sort((a, b) => Number(a) - Number(b))[0]),
      },
      guildid: String(options.guildid),
     },
    };
   case 'before':
    return {
     where: {
      uniquetimestamp: { lt: String(id) },
      guildid: String(options.guildid),
     },
    };
   case 'after':
    return {
     where: {
      uniquetimestamp: { gt: String(id) },
      guildid: String(options.guildid),
     },
    };
   default: {
    asArray = false;
    return { where: { uniquetimestamp: String(id) } };
   }
  }
 })();

 return Promise.all([
  DataBase.punish_bans
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Ban }) as const)),
  DataBase.punish_channelbans
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Channelban }) as const)),
  DataBase.punish_kicks
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Kick }) as const)),
  DataBase.punish_mutes
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Mute }) as const)),
  DataBase.punish_warns
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Warn }) as const)),
  ...(options?.includeTemp
   ? [
      DataBase.punish_tempchannelbans
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Tempchannelban }) as const)),
      DataBase.punish_tempbans
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Tempban }) as const)),
      DataBase.punish_tempmutes
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: PunishmentType.Tempmute }) as const)),
     ]
   : []),
 ]).then((r) => {
  const res = r.flat();
  if (asArray) {
   return res.filter((p) => !!p);
  }
  return res[0] || null;
 });
}

export default f;

/**
 * Returns an array of punishment records of a specific type for a given user ID.
 * @param id - The user ID to search for.
 * @param type - The type of punishment to search for.
 * Must be one of 'warn', 'mute', 'ban', 'channelban', or 'kick'.
 * @returns An array of punishment records of the specified type for the given user ID.
 * @throws An error if an unknown type is provided.
 */
const getWithType = (
 id: string,
 type:
  | PunishmentType.Warn
  | PunishmentType.Mute
  | PunishmentType.Ban
  | PunishmentType.Channelban
  | PunishmentType.Kick,
 includeTemp: boolean,
 guildid: string,
) => {
 switch (type) {
  case PunishmentType.Warn: {
   return DataBase.punish_warns
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Warn })));
  }
  case PunishmentType.Mute: {
   const perm = DataBase.punish_mutes
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Mute })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempmutes
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Tempmute }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case PunishmentType.Ban: {
   const perm = DataBase.punish_bans
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Ban })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempbans
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Tempban }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case PunishmentType.Channelban: {
   const perm = DataBase.punish_channelbans
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Channelban })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempchannelbans
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Tempchannelban }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case PunishmentType.Kick: {
   return DataBase.punish_kicks
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: PunishmentType.Kick })));
  }
  default: {
   throw new Error('Unkown type');
  }
 }
};
