import { scheduleDB } from '../Bot/Redis.js';
import { prefix } from './setRatelimit.js';

export default (key: string) => scheduleDB.get(`${prefix}:${key}`);
