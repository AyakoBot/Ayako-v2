import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';
import scanKeys from './scanKeys.js';

export default async (key: string) => {
 const keys = await scanKeys(`${prefix}:${key}`);
 if (!keys.length) return;

 const allKeys = [...keys, ...keys.map((k) => k.replace('scheduled', 'scheduled-data'))];
 await Redis.del(allKeys);
};
