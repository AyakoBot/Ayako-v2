import type { ChainableCommander } from 'ioredis';
import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';

export const dataPrefix = `scheduled-data`;

export default (key: string, value: string, expire: number, pipeline?: ChainableCommander) => {
 const pipe = pipeline || Redis.pipeline();

 pipe.setex(`${prefix}:${key}`, Math.round(expire), 'true');
 pipe.set(`${dataPrefix}:${key}`, value);

 if (pipeline) return pipe;
 return pipe.exec();
};
