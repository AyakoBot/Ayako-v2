import type { ChainableCommander } from 'ioredis';
import type Redis from 'ioredis';

export type ReturnType<T extends undefined | ChainableCommander> = T extends undefined
 ? Promise<[any, any][]>
 : T;

export class ScheduleManager {
 /**
  * The prefix used for scheduled tasks in Redis.
  * @public
  */
 public prefix = 'scheduled';
 /**
  * The prefix used for scheduled data in Redis.
  * @public
  */
 public dataPrefix = 'scheduled-data';
 /**
  * The Redis client used for caching.
  * @private
  */
 private redis: Redis;

 constructor(redis: Redis) {
  this.redis = redis;
 }

 /**
  * Sets a scheduled task in Redis with an expiration time.
  *
  * @param {string} key - The key for the scheduled task.
  * @param {string} value - The value to be stored.
  * @param {number} expire - The expiration time in seconds.
  * @param {T} [pipeline] - Optional Redis pipeline for batch processing.
  * @returns {Promise<void>} - A promise that resolves when the task is set.
  */
 public setScheduled<T extends undefined | ChainableCommander>(
  key: string,
  value: string,
  expire: number,
  pipeline?: T,
 ): ReturnType<T> {
  const pipe = pipeline || this.redis.pipeline();

  pipe.setex(`${this.prefix}:${key}`, Math.round(expire), 'true');
  pipe.set(`${this.dataPrefix}:${key}`, value);

  if (pipeline) return pipe as ReturnType<T>;
  return pipe.exec() as ReturnType<T>;
 }

 /**
  * Gets a scheduled task from Redis.
  *
  * @param {string} key - The key for the scheduled task.
  * @param {T} [pipeline] - Optional Redis pipeline for batch processing.
  * @returns {Promise<string | null>} - A promise that resolves to the value of the scheduled task.
  */
 public delScheduled<T extends undefined | ChainableCommander>(
  key: string,
  pipeline?: T,
 ): ReturnType<T> {
  const baseKey = `${this.prefix}:${key}`;
  const keys = [baseKey, baseKey.replace('scheduled:', 'scheduled-data:')];

  return (pipeline ? pipeline.del(...keys) : this.redis.del(...keys)) as ReturnType<T>;
 }

 /**
  * Checks if a scheduled task exists in Redis.
  *
  * @param {string} key - The key for the scheduled task.
  * @returns {Promise<boolean>} - A promise that resolves to true if the task exists, false otherwise.
  */
 public async hasScheduled(key: string): Promise<boolean> {
  const result = await this.redis.get(`${this.prefix}:${key}`);
  return result === 'true';
 }
}
