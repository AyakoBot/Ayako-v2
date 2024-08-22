import { Prisma, PrismaClient } from '@prisma/client';
import { metricsCollector } from './Metrics.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 metricsCollector.dbQuery(
  params.model ?? '-',
  params.action,
  'where' in params.args ? getInterestingWhereClause(params.args.where) : '-',
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

type Where = { [key: string]: string | unknown[] };

const getInterestingWhereClause = (
 where: (Where & { [key: string]: Where }) | null | undefined,
) => {
 if (!where) return '-';

 const isArray = (val: Where[string]) => (Array.isArray(val) ? 'Array' : val);

 return Object.keys(where)
  .map((k) => {
   switch (true) {
    case k === 'guildId':
    case k === 'guildid':
     return `Guild ${isArray(where.guildid || where.guildId)}`;
    case k === 'userid':
     return `User ${isArray(where.userid)}`;
    case k === 'executorid':
     return `Executor ${isArray(where.executorid)}`;
    case k === 'uniquetimestamp':
     return `ID ${where.uniquetimestamp}`;
    case k === 'channelid':
     return `Channel ${isArray(where.channelid)}`;
    default: {
     const val = where[k];

     switch (true) {
      case k.includes('guildid'):
      case k.includes('guildId'):
       return `Guild ${isArray(val.guildid || val.guildId)}`;
      case k.includes('userid'):
       return `User ${isArray(val.userid)}`;
      default:
       return '';
     }
    }
   }
  })
  .join(' ');
};

export default prisma;
