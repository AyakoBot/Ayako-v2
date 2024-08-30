import { Prisma } from '@prisma/client';
import { ExtensionArgs } from '@prisma/client/runtime/library.js';
import Redis from '../Redis.js';
import { getKey, handleFind } from './guildsettings.js';

const name = 'logchannels';

export default {
 [name]: {
  $allOperations: async (data) => {
   const guildIds = getKey<typeof name>(
    data.args.where as Prisma.logchannelsWhereUniqueInput,
    'guildid',
   );

   if (!guildIds?.length) return data.query(data.args);
   const keys = guildIds.map((guildId) => `${process.env.mainId}:${name}:${guildId}`);

   switch (data.operation) {
    case 'findMany':
    case 'findFirst':
    case 'findUnique':
     return handleFind<typeof name>(data, keys, name, 'guildid');
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
} as ExtensionArgs['query'];
