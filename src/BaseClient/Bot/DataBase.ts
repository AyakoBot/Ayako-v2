import { PrismaClient } from '@prisma/client';
import { metricsCollector } from './Metrics.js';

type OperationsArgs = {
 model: string;
 operation: string;
 args: any;
 query: (args: any) => Promise<any>;
};

const prisma = new PrismaClient().$extends({
 name: 'Metrics Middleware',
 model: {
  $allModels: {
   $allOperations: async ({ model, operation, args, query }: OperationsArgs) => {
    metricsCollector.dbQuery(model ?? '-', operation);

    const start = Date.now();
    const result = await query(args);
    metricsCollector.dbLatency(model ?? '-', operation, Date.now() - start);

    return result;
   },
  },
 },
});

export default prisma;
