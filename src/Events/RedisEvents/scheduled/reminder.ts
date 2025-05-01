import type { Reminder as DBReminder } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { Serialized } from 'discord-hybrid-sharding';
import { Reminder } from '../../../BaseClient/UtilModules/cache/bot/Reminder.js';

export default (payload: Serialized<DBReminder>) => {
 const reminder = new Reminder({ ...payload, startTime: new Decimal(payload.startTime) }, false);
 if (!reminder.expired()) return;

 reminder.end();
};
