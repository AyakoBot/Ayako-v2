import type { Reminder as DBReminder, PrismaClient } from '@prisma/client';
import type { Optional } from '@prisma/client/runtime/library.js';
import db from '../../../Bot/DataBase.js';
import redis from '../../../Bot/Redis.js';
import ExpirableCache, { CacheType } from './ExpirableCache.js';

/**
 * Class representing a scheduled reminder with database persistence.
 * This class handles creating, retrieving, checking and deleting reminders
 * with automatic scheduling based on a specified end time.
 */
export class Reminder extends ExpirableCache<DBReminder> {
 /**
  * Creates a new Reminder instance
  * @param opts - The reminder configuration options, with startTime being optional
  * @param init - Whether to initialize the reminder immediately
  */
 constructor(opts: Optional<DBReminder, 'startTime'>, init: boolean = true) {
  super(opts, CacheType.Reminder, init, redis, db as PrismaClient);
 }
}
