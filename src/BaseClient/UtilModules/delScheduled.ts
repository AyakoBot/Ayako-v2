import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';

export default async (key: string) => {
 const baseKey = `${prefix}:${key}`;
 const keys = [baseKey, baseKey.replace('scheduled:', 'scheduled-data:')];

 await Redis.del(keys).then(console.log);
};
