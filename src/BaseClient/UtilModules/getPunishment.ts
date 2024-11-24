import Prisma, { StoredPunishmentTypes, type punishments } from '@prisma/client';
import { StoredBaseAndTempType, StoredTempTypes } from '../../Typings/Typings.js';
import DataBase from '../Bot/DataBase.js';

type Picked = 'userid' | 'uniquetimestamp' | 'executorid' | 'guildid';

function f(id: number): Promise<punishments | null>;
function f(id: string): Promise<punishments | null>;
function f(
 id: number,
 options: {
  includeTemp?: boolean;
  identType: 'between';
  ident: number;
  guildid: string;
 },
): Promise<punishments[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'by';
  ident: string;
  guildid: string;
 },
): Promise<punishments[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'with-type';
  ident: Parameters<typeof getWithType>[1];
  guildid: string;
 },
): Promise<punishments[] | null>;
function f(
 id: number,
 options: {
  includeTemp?: boolean;
  identType: 'after' | 'before';
  guildid: string;
 },
): Promise<punishments[] | null>;
function f(
 id: string,
 options: {
  includeTemp?: boolean;
  identType: 'all-by' | 'all-on';
  guildid: string;
 },
): Promise<punishments[] | null>;
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
): Promise<punishments | punishments[] | null> {
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
  where: Pick<Prisma.Prisma.punishmentsWhereInput, Picked>;
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

 const res = await DataBase.punishments.findMany({
  where: { ...where, type: !options?.includeTemp ? undefined : { notIn: StoredTempTypes } },
 });

 return asArray ? res : res[0];
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
 type: StoredPunishmentTypes,
 includeTemp: boolean,
 guildid: string,
) =>
 DataBase.punishments.findMany({
  where: { userid: id, guildid, type: includeTemp ? { in: StoredBaseAndTempType[type] } : type },
 });
