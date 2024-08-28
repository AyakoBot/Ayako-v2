import { Prisma, PrismaClient } from '@prisma/client';
import { metricsCollector } from './Metrics.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 metricsCollector.dbQuery(params.model ?? '-', params.action);

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

export default prisma;
