import { Prisma, PrismaClient } from '@prisma/client';
import { metricsCollector } from './Metrics.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 const where = getInterestingWhereClause(params);

 metricsCollector.dbQuery(
  params.model ?? '-',
  params.action,
  where.guild,
  where.user,
  where.executor,
  where.uts,
  where.channel,
 );

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

type Where = { [key: string]: string | unknown[] } & { [key: string]: Where };

const getInterestingWhereClause = (args: Prisma.MiddlewareParams['args']) => {
 if (!('where' in args)) return '-';
 if (!args.where) return '-';

 const where: Where = args.where;

 const isArray = (val: Where[string]) => (typeof val !== 'string' ? 'Array' : (val as string));

 const values = Object.keys(where).map((k) => {
  switch (true) {
   case k === 'guildId':
   case k === 'guildid':
    return { guild: isArray(where.guildid || where.guildId) };
   case k === 'userid':
    return { user: isArray(where.userid) };
   case k === 'executorid':
    return { executor: isArray(where.executorid) };
   case k === 'uniquetimestamp':
    return { uts: where.uniquetimestamp as string };
   case k === 'channelid':
    return { channel: isArray(where.channelid) };
   default: {
    const val = where[k];

    switch (true) {
     case k.includes('guildid'):
     case k.includes('guildId'):
      return { guild: isArray(val.guildid || val.guildId) };
     case k.includes('userid'):
      return { user: isArray(val.userid) };
     default:
      return {};
    }
   }
  }
 });

 return Object.assign({}, ...values);
};

export default prisma;
