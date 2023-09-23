import Prisma from '@prisma/client';
import DataBase from '../DataBase.js';

export type Returned = (
 | Prisma.punish_bans
 | Prisma.punish_channelbans
 | Prisma.punish_kicks
 | Prisma.punish_mutes
 | Prisma.punish_warns
) & {
 type: 'punish_bans' | 'punish_channelbans' | 'punish_kicks' | 'punish_mutes' | 'punish_warns';
};

function f(id: number): Promise<Returned | null>;
function f(id: number, identType: 'between', ident: number): Promise<Returned[] | null>;
function f(id: string, identType: 'by', ident: 'string'): Promise<Returned[] | null>;
function f(
 id: string,
 identType: 'with-type',
 ident: Parameters<typeof getWithType>[1],
): Promise<Returned[] | null>;
function f(id: string, identType: 'all-by' | 'all-on'): Promise<Returned[] | null>;
function f(id: number, identType: 'after' | 'before'): Promise<Returned[] | null>;
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
 identType?: 'after' | 'before' | 'between' | 'by' | 'all-on' | 'all-by' | 'with-type',
 ident?: string | number,
): Promise<Returned | Returned[] | Returned[] | null> {
 let asArray = true;

 if (identType === 'with-type') {
  return getWithType(id as string, ident as Parameters<typeof getWithType>[1]) as ReturnType<
   typeof f
  >;
 }

 const where = (() => {
  switch (identType) {
   case 'all-on': {
    return { where: { userid: String(id) } };
   }
   case 'by': {
    return { where: { userid: String(id), executorid: String(ident) } };
   }
   case 'all-by': {
    return { where: { executorid: String(id) } };
   }
   case 'between': {
    return {
     where: {
      uniquetimestamp: {
       lt: String([id, ident].sort((a, b) => Number(b) - Number(a))[0]),
       gt: String([id, ident].sort((a, b) => Number(a) - Number(b))[0]),
      },
     },
    };
   }
   case 'before': {
    return { where: { uniquetimestamp: { lt: String(id) } } };
   }
   case 'after': {
    return { where: { uniquetimestamp: { gt: String(id) } } };
   }
   default: {
    asArray = false;
    return { where: { uniquetimestamp: String(id) } };
   }
  }
 })();

 return Promise.all([
  DataBase.punish_bans.findMany(where as never).then((r) => ({ ...r, type: 'punish_bans' })),
  DataBase.punish_channelbans.findMany(where as never).then((r) => ({ ...r, type: 'punish_bans' })),
  DataBase.punish_kicks.findMany(where as never).then((r) => ({ ...r, type: 'punish_bans' })),
  DataBase.punish_mutes.findMany(where as never).then((r) => ({ ...r, type: 'punish_bans' })),
  DataBase.punish_warns.findMany(where as never).then((r) => ({ ...r, type: 'punish_bans' })),
 ]).then((r) => {
  const res = r.flat();
  if (asArray) {
   return res.filter((p): p is Returned => !!p);
  }
  return (res[0] as Returned) || null;
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
const getWithType = (id: string, type: 'warn' | 'mute' | 'ban' | 'channelban' | 'kick') => {
 switch (type) {
  case 'warn': {
   return DataBase.punish_warns.findMany({ where: { userid: id } });
  }
  case 'mute': {
   return DataBase.punish_mutes.findMany({ where: { userid: id } });
  }
  case 'ban': {
   return DataBase.punish_bans.findMany({ where: { userid: id } });
  }
  case 'channelban': {
   return DataBase.punish_channelbans.findMany({ where: { userid: id } });
  }
  case 'kick': {
   return DataBase.punish_kicks.findMany({ where: { userid: id } });
  }
  default: {
   throw new Error('Unkown type');
  }
 }
};
