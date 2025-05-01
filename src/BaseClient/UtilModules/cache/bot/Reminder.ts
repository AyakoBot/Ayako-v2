import type { Reminder as DBReminder, PrismaClient } from '@prisma/client';
import db from '../../../Bot/DataBase.js';
import redis from '../../../Bot/Redis.js';
import getColor from '../../getColor.js';
import getLanguage from '../../getLanguage.js';
import getUser from '../../getUser.js';
import send from '../../send.js';
import ExpirableCache, { ExpirableCacheType, type ExpirableCacheOpts } from './ExpirableCache.js';

/**
 * Class representing a scheduled reminder with database persistence.
 * This class handles creating, retrieving, checking and deleting reminders
 * with automatic scheduling based on a specified end time.
 */
export class Reminder<K extends boolean = true> extends ExpirableCache<DBReminder, K> {
 /**
  * Creates a new Reminder instance
  * @param opts - The reminder configuration options, with startTime being optional
  * @param init - Whether to initialize the reminder immediately
  */
 constructor(opts: ExpirableCacheOpts<DBReminder, K>, init: K = true as K) {
  super(opts, ExpirableCacheType.Reminder, init, redis, db as PrismaClient);
 }

 async end() {
  const data = await this.get();

  if (!data) {
   this.delete();
   return;
  }

  const user = await getUser(data.userId);
  if (!user) return;

  const language = await getLanguage(undefined);
  const lan = language.slashCommands.reminder;

  send(user, {
   content: lan.reminderEnded(data.userId),
   embeds: [{ description: data.reason, color: getColor() }],
  });

  this.delete();
 }
}
