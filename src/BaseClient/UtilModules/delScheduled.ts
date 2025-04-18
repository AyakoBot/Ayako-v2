import type { ChainableCommander } from 'ioredis';
import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';

export default (key: string, pipeline?: ChainableCommander) => {
 const baseKey = `${prefix}:${key}`;
 const keys = [baseKey, baseKey.replace('scheduled:', 'scheduled-data:')];

 return pipeline ? pipeline.del(keys) : Redis.del(keys);
};
