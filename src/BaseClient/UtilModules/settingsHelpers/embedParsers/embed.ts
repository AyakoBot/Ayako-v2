import { Prisma } from '@prisma/client';
import * as CT from '../../../../Typings/Typings.js';
import DataBase from '../../../Bot/DataBase.js';

/**
 * Parser for embed type settings.
 * @param val - The unique timestamp of the custom embed to parse.
 * @param language - The language object containing translations.
 * @returns The name of the custom embed or the "None" string if the value is falsy.
 */
export default async (val: Prisma.Decimal | null, language: CT.Language) =>
 val
  ? (await DataBase.customembeds.findUnique({ where: { uniquetimestamp: val } }))?.name ??
    language.t.None
  : language.t.None;
