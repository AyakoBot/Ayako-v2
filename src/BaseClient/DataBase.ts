import { Prisma, PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { createPrismaRedisCache } from 'prisma-redis-middleware';
import log from './ClientHelperModules/logError.js';

const prisma = new PrismaClient();

if (process.env.useRedis) {
 const redis = new Redis();

 const options: Parameters<typeof createPrismaRedisCache>[0] = {
  storage: {
   type: 'redis',
   options: {
    client: redis,
    invalidation: {
     referencesTTL: 300,
    },
    log: process.argv.includes('--debug-queries') ? console : undefined,
   },
  },
  cacheTime: 300,
 };

 if (process.argv.includes('--debug-db')) {
  options.onHit = (key) => log(`[Redis] Cache Hit: ${key}`, true);
  options.onDedupe = (key) => log(`[Redis] Cache Dedupe: ${key}`, true);
  options.onMiss = (key) => log(`[Redis] Cache Miss: ${key}`, true);
  options.onError = (error) => log(`[Redis] Error: ${error}`, true);
 }

 const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache(options);

 prisma.$use(cacheMiddleware);

 redis.on('connect', () => log('[Redis] Connecting to Redis...', true));
 redis.on('ready', () => log('[Redis] Established Connection to DataBase', true));
 redis.on('error', (err) => log(`[Redis] Error: ${err}`, true));
 redis.on('reconnecting', () => log('[Redis] Connection lost. Re-connecting...', true));
}

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
