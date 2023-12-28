import { Prisma, PrismaClient } from '@prisma/client';
import log from './ClientHelperModules/logError.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 try {
  const result = await next(params);
  return result;
 } catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
   if (process.argv.includes('--debug-db')) log(`[Prisma] Error: ${error}`, true);
   return null;
  }
  throw error;
 }
});

export default prisma;
