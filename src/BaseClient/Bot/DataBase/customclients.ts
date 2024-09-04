import { Prisma } from '@prisma/client';
import Redis from '../Redis.js';
import { getKey, handleFind } from './guildsettings.js';

const name = 'customclients';

export default Prisma.defineExtension({
 query: {
  [name]: {
   $allOperations: async (data) => {
    if (!('where' in data.args) || !data.args.where) return data.query(data.args);
    if (!data.args.where) return data.query(data.args);

    const guildIds = getKey<typeof name>(
     data.args.where as Prisma.customclientsWhereUniqueInput,
     'guildid',
    );

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
