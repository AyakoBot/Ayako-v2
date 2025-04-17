/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@prisma/client';
import type {
 DefaultArgs,
 DynamicQueryExtensionCb,
 InternalArgs,
} from '@prisma/client/runtime/library.js';
import type { DataBaseTables, MaybeArray, RequiredOnly } from '../../Typings/Typings.js';
import metricsCollector from './Metrics.js';
import Redis from './Redis.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 try {
  const result = await next(params);
  return result;
 } catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
   // eslint-disable-next-line no-console
   if (process.argv.includes('--debug-db')) console.log(`[Prisma] Error: ${error}`);
   return null;
  }
  throw error;
 }
});

export default prisma
 .$extends({
  name: 'Cache Middleware',
  query: {
   guildsettings: {
    $allOperations: async (data) => handleOperation('guildsettings', 'guildid', data as never),
   },
   logchannels: {
    $allOperations: async (data) => handleOperation('logchannels', 'guildid', data as never),
   },
   customclients: {
    $allOperations: async (data) => handleOperation('customclients', 'guildid', data as never),
   },
  },
 })
 .$extends({
  name: 'Metrics Middleware',
  query: {
   $allOperations: async ({ model, operation, args, query }) => {
    metricsCollector.dbQuery(model ?? '-', operation);

    const start = Date.now();
    const result = await query(args);
    metricsCollector.dbLatency(model ?? '-', operation, Date.now() - start);

    return result;
   },
  },
 });

type Operations<T extends keyof Prisma.TypeMap['model']> = Prisma.TypeMap['model'][T]['operations'];
type Args<
 T extends keyof Prisma.TypeMap['model'],
 K extends keyof Operations<T>,
> = Operations<T>[K];

export const getKey = <T extends keyof Prisma.TypeMap['model']>(
 where: Args<T, 'findMany'>['args']['where'] | Prisma.StringFilter | undefined,
 keyName: keyof RequiredOnly<Args<T, 'findUnique'>['args']['where']>,
): string[] | null => {
 if (!where) return null;
 if (!(keyName in where)) return null;

 // @ts-expect-error
 const keyVal = where[keyName as keyof typeof where];

 if (!keyVal) return null;
 if (typeof keyVal === 'string') return [keyVal];
 if (typeof keyVal !== 'object') return null;
 if ('in' in keyVal && keyVal.in) {
  if (!Array.isArray(keyVal.in)) return null;
  return keyVal.in;
 }

 return null;
};

export const handleFind = async <T extends keyof DataBaseTables>(
 data: Parameters<
  DynamicQueryExtensionCb<
   Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
   'model',
   T,
   | 'findUnique'
   | 'findUniqueOrThrow'
   | 'findFirst'
   | 'findFirstOrThrow'
   | 'findMany'
   | 'create'
   | 'createMany'
   | 'createManyAndReturn'
   | 'delete'
   | 'update'
   | 'deleteMany'
   | 'updateMany'
   | 'upsert'
   | 'aggregate'
   | 'groupBy'
   | 'count'
  >
 >[0],
 keys: string[],
 tableName: T,
 keyName: keyof DataBaseTables[T],
) => {
 const cached = await Promise.all(keys.map((key) => Redis.get(key)));

 if (cached.some((c) => c === null) || !cached.length) {
  return cacheNewEntry(
   (await data.query(data.args as Parameters<typeof data.query>[0])) as MaybeArray<
    DataBaseTables[T]
   >,
   tableName,
   keyName,
  );
 }

 if (!isValid(cached as string[])) {
  return data.query(data.args as Parameters<typeof data.query>[0]);
 }

 const validCached = (cached as string[]).map((c) => JSON.parse(c) as DataBaseTables[T]);

 return ['findUnique', 'findFirst'].includes(data.operation) ? validCached[0] : validCached;
};

export const cacheNewEntry = <T extends keyof DataBaseTables>(
 res: MaybeArray<DataBaseTables[T]>,
 tableName: T,
 keyName: keyof DataBaseTables[T],
) => {
 if ((Array.isArray(res) && !res.length) || !res) return res;

 if (Array.isArray(res)) {
  res
   .filter((r) => !!r[keyName])
   .forEach((r) =>
    Redis.set(`settings:${tableName}:${r[keyName]}`, JSON.stringify(r)),
   );
 } else if (res[keyName]) {
  Redis.set(`settings:${tableName}:${res[keyName]}`, JSON.stringify(res));
 }

 return res;
};

export const isValid = (cached: string[]) => {
 try {
  cached.forEach((c) => JSON.parse(c));
  return true;
 } catch {
  return false;
 }
};

export const handleOperation = <T extends keyof Prisma.TypeMap['model'] & keyof DataBaseTables>(
 name: T,
 index: keyof RequiredOnly<Args<T, 'findUnique'>['args']['where']> & keyof DataBaseTables[T],
 data: Parameters<
  DynamicQueryExtensionCb<
   Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
   'model',
   T,
   | 'findUnique'
   | 'findUniqueOrThrow'
   | 'findFirst'
   | 'findFirstOrThrow'
   | 'findMany'
   | 'create'
   | 'createMany'
   | 'createManyAndReturn'
   | 'delete'
   | 'update'
   | 'deleteMany'
   | 'updateMany'
   | 'upsert'
   | 'aggregate'
   | 'groupBy'
   | 'count'
  >
 >[0],
) => {
 if (!('where' in data.args) || !data.args.where) return data.query(data.args);
 if (!data.args.where) return data.query(data.args);

 const indexValues = getKey<typeof name>(data.args.where, index);

 if (!indexValues?.length) return data.query(data.args);
 const keys = indexValues.map((value) => `settings:${name}:${value}`);

 switch (data.operation) {
  case 'findMany':
  case 'findFirst':
  case 'findUnique':
   return handleFind(data, keys, name, index);
  case 'update':
  case 'updateMany':
  case 'upsert':
  case 'create':
  case 'delete':
  case 'deleteMany':
  case 'createMany':
  case 'createManyAndReturn':
   keys.forEach((key) => (key.length ? Redis.del(key) : 0));
   return data.query(data.args);
  default:
   return data.query(data.args);
 }
};
