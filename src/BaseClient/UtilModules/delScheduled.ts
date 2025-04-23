import type { ChainableCommander } from 'ioredis';
import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';
import type { ReturnType } from './setScheduled.js';

export default <T extends undefined | ChainableCommander>(
 key: string,
 pipeline?: T,
): ReturnType<T> => {
 const baseKey = `${prefix}:${key}`;
 const keys = [baseKey, baseKey.replace('scheduled:', 'scheduled-data:')];

 return (pipeline ? pipeline.del(...keys) : Redis.del(...keys)) as ReturnType<T>;
};
