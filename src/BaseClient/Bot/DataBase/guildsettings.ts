import { Prisma } from '@prisma/client';
import {
 DefaultArgs,
 DynamicQueryExtensionCb,
 InternalArgs,
} from '@prisma/client/runtime/library.js';
import { DataBaseTables, MaybeArray, RequiredOnly } from 'src/Typings/Typings.js';
import Redis from '../Redis.js';

const name = 'guildsettings';

export default Prisma.defineExtension({
 query: {
  [name]: {
   $allOperations: async (data) => {
    if (!('where' in data.args) || !data.args.where) return data.query(data.args);
    if (!data.args.where) return data.query(data.args);

    const guildIds = getKey<typeof name>(data.args.where, 'guildid');

    if (!guildIds?.length) return data.query(data.args);
    const keys = guildIds.map((guildId) => `${process.env.mainId}:${name}:${guildId}`);

    switch (data.operation) {
     case 'findMany':
     case 'findFirst':
     case 'findUnique':
      return handleFind(data, keys, name, 'guildid');
     case 'update':
     case 'updateMany':
     case 'upsert':
     case 'create':
     case 'delete':
     case 'deleteMany':
     case 'create':
     case 'createMany':
     case 'createManyAndReturn':
      keys.forEach((key) => Redis.del(key));
      return data.query(data.args);
     default:
      return data.query(data.args);
    }
   },
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
   'guildsettings',
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
 {
  const cached = await Promise.all(keys.map((key) => Redis.get(key)));

  if (cached.some((c) => c === null) || !cached.length) {
   return cacheNewEntry(
    (await data.query(data.args)) as MaybeArray<DataBaseTables[T]>,
    tableName,
    keyName,
   );
  }

  if (!isValid(cached as string[])) return data.query(data.args);
  const validCached = (cached as string[]).map((c) => JSON.parse(c) as DataBaseTables[T]);

  return ['findUnique', 'findFirst'].includes(data.operation) ? validCached[0] : validCached;
 }
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
    Redis.set(`${process.env.mainId}:${tableName}:${r[keyName]}`, JSON.stringify(r)),
   );
 } else if (res[keyName]) {
  Redis.set(`${process.env.mainId}:${tableName}:${res[keyName]}`, JSON.stringify(res));
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
