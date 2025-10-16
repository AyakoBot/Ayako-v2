import Redis from 'ioredis';
import { glob } from 'glob';

export const prefix = 'cache';
const cacheDBnum = process.argv.includes('--dev') ? 2 : 0;
const scheduleDBnum = process.argv.includes('--dev') ? 3 : 1;

export const cacheDB = new Redis({ host: 'redis', db: cacheDBnum });
export const cacheSub = new Redis({ host: 'redis', db: cacheDBnum });
export const scheduleDB = new Redis({ host: 'redis', db: scheduleDBnum });
export const scheduleSub = new Redis({ host: 'redis', db: scheduleDBnum });

export default cacheDB;

await cacheDB.config('SET', 'notify-keyspace-events', 'Ex');
await scheduleDB.config('SET', 'notify-keyspace-events', 'Ex');

await cacheSub.subscribe(`__keyevent@${cacheDBnum}__:expired`);
await scheduleSub.subscribe(`__keyevent@${scheduleDBnum}__:expired`);

const callback = async (channel: string, key: string) => {
 if (
  channel !== `__keyevent@${cacheDBnum}__:expired` &&
  channel !== `__keyevent@${scheduleDBnum}__:expired`
 ) {
  return;
 }

 if (key.includes('scheduled-data:')) return;

 const keyArgs = key.split(/:/g).splice(0, 3);
 const path = keyArgs.filter((k) => Number.isNaN(+k)).join('/');

 const dataKey = key.replace('scheduled:', 'scheduled-data:');
 const dbNum = channel.split('@')[1].split(':')[0];
 const db = dbNum === String(cacheDBnum) ? cacheDB : scheduleDB;

 const value = await db.get(dataKey);
 db.expire(dataKey, 10);

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Events/RedisEvents/scheduled/**/*`,
 );

 const file = files.find((f) => f.endsWith(`${path}.js`));
 if (!file) return;

 (await import(file)).default(value ? JSON.parse(value) : undefined);
};

cacheSub.on('message', callback);
scheduleSub.on('message', callback);
