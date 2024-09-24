/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@prisma/client';
import metricsCollector from './Metrics.js';

import logchannels from './DataBase/logchannels.js';
import guildsettings from './DataBase/guildsettings.js';
import customclients from './DataBase/customclients.js';

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
   ...(logchannels as any),
   ...(guildsettings as any),
   ...(customclients as any),
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
