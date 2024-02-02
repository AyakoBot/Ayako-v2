import { Prisma, PrismaClient } from '@prisma/client';
import util from '../UtilModules/importCache/BaseClient/UtilModules.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
 try {
  const result = await next(params);
  return result;
 } catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
   if (process.argv.includes('--debug-db')) {
    util.logError.file.default(`[Prisma] Error: ${error}`, true);
   }
   return null;
  }
  throw error;
 }
});

export default prisma;
