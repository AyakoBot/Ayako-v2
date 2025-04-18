import type { Optional } from '@prisma/client/runtime/library.js';
import db from '../../../Bot/DataBase.js';
import delScheduled from '../../delScheduled.js';
import setScheduled from '../../setScheduled.js';

import type { Reminder as DBReminder } from '@prisma/client';

/**
 * A cache class for handling expirable data with database persistence.
 *
 * @template T Type extending the base DBReminder type
 */
export default class ExpirableCache<T extends DBReminder> {
 /**
  * Unique identifier for this cache entry, defaults to current timestamp if not provided
  * @private
  */
 private id: number;

 /**
  * Type of data this cache is handling
  * @public
  */
 public type: 'reminder';

 /**
  * Creates a new expirable cache instance.
  *
  * @param {Optional<T, 'startTime'>} opts - Configuration options for the data, where startTime is optional
  * @param {(typeof ExpirableCache)['prototype']['type']} type - The type of data this cache will handle
  * @param {boolean} [init=true] - Whether to initialize the data in the database immediately
  */
 constructor(
  opts: Optional<T, 'startTime'>,
  type: (typeof ExpirableCache)['prototype']['type'],
  init: boolean = true,
 ) {
  this.id = Number(opts.startTime) || Date.now();
  this.type = type;

  if (!init) return;
  this.init(opts);
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
   ? db[this.type].upsert({
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
   : db[this.type].create({
      data: {
       userId: opts.userId,
       channelId: opts.channelId,
       reason: opts.reason,
       endTime: opts.endTime,
       startTime: this.id,
      },
     }));

  setScheduled(this.key, JSON.stringify(data), diff);
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
  return db[this.type].findUnique({ where: { startTime: this.id } });
 }

 /**
  * Checks if the data has expired based on its end time.
  *
  * @returns {Promise<boolean>} True if the data has expired, otherwise false
  * @throws {Error} If the data data cannot be found in the database
  */
 async expired() {
  const data = await db[this.type].findUnique({ where: { startTime: Number(this.id) } });
  if (!data) throw new Error(`Data ${this.type} not found`);

  return Number(data.endTime) < Date.now();
 }

 /**
  * Deletes the data from the database and removes any scheduled tasks.
  *
  * @returns {void}
  */
 delete() {
  db[this.type].delete({ where: { startTime: this.id } }).then();
  delScheduled(this.key);
 }
}
