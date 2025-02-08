import redis from '../Bot/Redis.js';

export default async (pattern: string) => {
 const keys: string[] = [];
 let cursor = '0';

 do {
  // eslint-disable-next-line no-await-in-loop
  const [nextCursor, scanKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
  cursor = nextCursor;
  keys.push(...scanKeys);
 } while (cursor !== '0');

 return keys;
};
