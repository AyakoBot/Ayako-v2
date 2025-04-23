import type { Reminder as DBReminder, PrismaClient } from '@prisma/client';
import type { Decimal, Optional } from '@prisma/client/runtime/library.js';
import type Redis from 'ioredis';
import delScheduled from '../../delScheduled.js';
import setScheduled from '../../setScheduled.js';

export enum ExpirableCacheType {
 Reminder = 'reminder',
}

export type ExpirableCacheOpts<T extends DBReminder, K extends boolean> = K extends true
 ? Optional<T, 'startTime'>
 : { startTime: Decimal; userId: Decimal };

/**
 * A cache class for handling expirable data with database persistence.
 *
 * @template T Type extending the base DBReminder type
 * @template K Boolean indicating whether to initialize the data
 */
export default class ExpirableCache<T extends DBReminder, K extends boolean = true> {
 /**
  * Unique identifier for this cache entry, defaults to current timestamp if not provided
  * @private
  */
 private id: number;

 /**
  * Type of data this cache is handling
  * @public
  */
 public type: ExpirableCacheType;

 /**
  * Redis client for caching
  * @private
  */
 private redis: Redis;

 /**
  * Database client for database operations
  * @private
  */
 private db: PrismaClient;

 /**
  * The options used for storing the data
  * @private
  */
 private opts: ExpirableCacheOpts<T, K>;

 /**
  * Creates a new expirable cache instance.
  *
  * @param {ExpirableCacheOpts<T, K>} opts - Configuration options for the data
  * @param {ExpirableCacheType} type - The type of data this cache will handle
  * @param {K} init - Whether to initialize the data in the database immediately
  * @param {Redis} redis - Redis client for caching
  * @param {PrismaClient} db - Database client for persistence
  */
 constructor(
  opts: ExpirableCacheOpts<T, K>,
  type: ExpirableCacheType,
  init: K,
  redis: Redis,
  db: PrismaClient,
 ) {
  this.id = Number(opts.startTime) || Date.now();
  this.type = type;
  this.redis = redis;
  this.db = db;
  this.opts = opts as ExpirableCacheOpts<T, K>;

  if (init === (false as any)) return;
  this.init(opts as Optional<T, 'startTime'>);
 }

 /**
  * Initializes the data in the database and schedules it for execution.
  *
  * @private
  * @param {Optional<T, 'startTime'>} opts - Data options with optional startTime
  * @returns {Promise<void>}
  */
 private async init(opts: Optional<T, 'startTime'>) {
  const diff = Math.abs(Number(opts.endTime) - Date.now()) / 1000;

  const data = await (opts.startTime
   ? this.db[this.type].upsert({
      where: { startTime: opts.startTime },
      create: {
       userId: opts.userId,
       channelId: opts.channelId,
       reason: opts.reason,
       endTime: opts.endTime,
       startTime: this.id,
      },
      update: {},
     })
   : this.db[this.type].create({
      data: {
       userId: opts.userId,
       channelId: opts.channelId,
       reason: opts.reason,
       endTime: opts.endTime,
       startTime: this.id,
      },
     }));

  const pipeline = this.redis.pipeline();
  setScheduled(this.key, JSON.stringify(data), diff, pipeline);
  pipeline.exec();
 }

 /**
  * Gets the unique key for this data in the format "type:id".
  *
  * @returns {string} The formatted key string
  */
 get key() {
  return `${this.type}:${this.id}`;
 }

 /**
  * Retrieves the current data data from the database.
  *
  * @returns {Promise<T | null>} The data data or null if not found
  */
 async get() {
  return this.db[this.type].findUnique({ where: { startTime: this.id } });
 }

 /**
  * Checks if the data has expired based on its end time.
  *
  * @returns {Promise<boolean>} True if the data has expired, otherwise false
  * @throws {Error} If the data data cannot be found in the database
  */
 async expired() {
  const data = await this.db[this.type].findUnique({ where: { startTime: Number(this.id) } });
  if (!data) throw new Error(`Data ${this.type} not found`);

  return Number(data.endTime) < Date.now();
 }

 /**
  * Deletes the data from the database and removes any scheduled tasks.
  *
  * @returns {void}
  */
 delete() {
  this.db[this.type]
   .delete({
    where: { startTime: this.id, userId: this.opts.userId ? String(this.opts.userId) : undefined },
   })
   .then();

  const pipeline = this.redis.pipeline();
  delScheduled(this.key, pipeline);
  pipeline.exec();
 }

 /**
  * Converts the data to a JSON object.
  *
  * @returns {Optional<T, 'startTime'> | { startTime: Decimal }} The data as a JSON object
  */
 toJSON() {
  return this.opts;
 }
}
