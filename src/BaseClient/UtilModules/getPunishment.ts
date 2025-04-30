import Prisma, { StoredPunishmentTypes, type punishments } from '@prisma/client';
import { StoredBaseAndTempType, StoredTempTypes } from '../../Typings/Typings.js';
import DataBase from '../Bot/DataBase.js';

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
  ident: StoredPunishmentTypes;
  guildid: string;
 },
): Promise<punishments[] | null>;
function f(
 id: number,
 options: {
  includeTemp?: boolean;
  identType: 'after' | 'before';
  guildid: string;
  ident?: string;
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
  return DataBase.punishments.findMany({
   where: {
    userid: id as string,
    guildid: options.guildid,
    type: options.includeTemp
     ? { in: StoredBaseAndTempType[options.ident as StoredPunishmentTypes] }
     : (options.ident as StoredPunishmentTypes),
   },
  });
 }

 const where: Pick<
  Prisma.Prisma.punishmentsWhereInput,
  'userid' | 'uniquetimestamp' | 'executorid' | 'guildid'
 > = (() => {
  switch (options?.identType) {
   case 'all-on':
    return { userid: String(id), guildid: String(options.guildid) };
   case 'by':
    return {
     userid: String(id),
     executorid: String(options.ident),
     guildid: String(options.guildid),
    };
   case 'all-by':
    return { executorid: String(id), guildid: String(options.guildid) };
   case 'between':
    return {
     uniquetimestamp: {
      lt: String([id, options.ident].sort((a, b) => Number(b) - Number(a))[0]),
      gt: String([id, options.ident].sort((a, b) => Number(a) - Number(b))[0]),
     },
     guildid: String(options.guildid),
    };
   case 'before':
    return {
     uniquetimestamp: { lt: String(id) },
     guildid: String(options.guildid),
     executorid: options.ident ? String(options.ident) : undefined,
    };
   case 'after':
    return {
     uniquetimestamp: { gt: String(id) },
     guildid: String(options.guildid),
     executorid: options.ident ? String(options.ident) : undefined,
    };
   default: {
    asArray = false;
    return { uniquetimestamp: String(id) };
   }
  }
 })();

 const res = await DataBase.punishments.findMany({
  where: { ...where, type: !options?.includeTemp ? undefined : { notIn: StoredTempTypes } },
 });

 return asArray ? res : res[0];
}

export default f;
