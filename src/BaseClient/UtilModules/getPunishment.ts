import Prisma from '@prisma/client';
import DataBase from '../Bot/DataBase.js';

type Picked = 'userid' | 'uniquetimestamp' | 'executorid' | 'guildid';

export type Returned = (
 | Prisma.punish_bans
 | Prisma.punish_channelbans
 | Prisma.punish_kicks
 | Prisma.punish_mutes
 | Prisma.punish_warns
) & {
 type:
  | 'punish_bans'
  | 'punish_channelbans'
  | 'punish_kicks'
  | 'punish_mutes'
  | 'punish_warns'
  | 'punish_tempbans'
  | 'punish_tempmutes'
  | 'punish_tempchannelbans';
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
   .then((r) => r.map((r2) => ({ ...r2, type: 'punish_bans' }) as const)),
  DataBase.punish_channelbans
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: 'punish_channelbans' }) as const)),
  DataBase.punish_kicks
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: 'punish_kicks' }) as const)),
  DataBase.punish_mutes
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: 'punish_mutes' }) as const)),
  DataBase.punish_warns
   .findMany(where as never)
   .then((r) => r.map((r2) => ({ ...r2, type: 'punish_warns' }) as const)),
  ...(options?.includeTemp
   ? [
      DataBase.punish_tempchannelbans
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: 'punish_tempchannelbans' }) as const)),
      DataBase.punish_tempbans
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: 'punish_tempbans' }) as const)),
      DataBase.punish_tempmutes
       .findMany(where as never)
       .then((r) => r.map((r2) => ({ ...r2, type: 'punish_tempmutes' }) as const)),
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
 type: 'warn' | 'mute' | 'ban' | 'channelban' | 'kick',
 includeTemp: boolean,
 guildid: string,
) => {
 switch (type) {
  case 'warn': {
   return DataBase.punish_warns
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: 'punish_warns' })));
  }
  case 'mute': {
   const perm = DataBase.punish_mutes
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: 'punish_mutes' })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempmutes
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: 'punish_tempmutes' }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case 'ban': {
   const perm = DataBase.punish_bans
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: 'punish_bans' })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempbans
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: 'punish_tempbans' }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case 'channelban': {
   const perm = DataBase.punish_channelbans
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: 'punish_channelbans' })));
   return includeTemp
    ? Promise.all([
       perm,
       DataBase.punish_tempchannelbans
        .findMany({ where: { userid: id, guildid } })
        .then((r) => r.map((p) => ({ ...p, type: 'punish_tempchannelbans' }))),
      ]).then((r) => r.flat())
    : perm;
  }
  case 'kick': {
   return DataBase.punish_kicks
    .findMany({ where: { userid: id, guildid } })
    .then((r) => r.map((p) => ({ ...p, type: 'punish_kicks' })));
  }
  default: {
   throw new Error('Unkown type');
  }
 }
};
