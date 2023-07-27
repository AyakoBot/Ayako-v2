import { PrismaClient, Prisma } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';
import Redis from 'ioredis';
import * as CT from '../Typings/CustomTypings.js';

const { log } = console;

const redis = new Redis();
const prisma = new PrismaClient();

const options: CT.Argument<typeof createPrismaRedisCache, 0> = {
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
 options.onHit = (key) => log(`[Redis] Cache Hit: ${key}`);
 options.onDedupe = (key) => log(`[Redis] Cache Dedupe: ${key}`);
 options.onMiss = (key) => log(`[Redis] Cache Miss: ${key}`);
 options.onError = (error) => log(`[Redis] Error: ${error}`);
}

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache(options);

prisma.$use(cacheMiddleware);

redis.on('connect', () => log('[Redis] Connecting to Redis...'));
redis.on('ready', () => log('[Redis] Established Connection to DataBase'));
redis.on('error', (err) => log(`[Redis] Error: ${err}`));
redis.on('reconnecting', () => log('[Redis] Connection lost. Re-connecting...'));

export default prisma;
