import type { ChainableCommander } from 'ioredis';
import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';

export const dataPrefix = `scheduled-data`;
export type ReturnType<T extends undefined | ChainableCommander> = T extends undefined
 ? Promise<[any, any][]>
 : T;

export default <T extends undefined | ChainableCommander>(
 key: string,
 value: string,
 expire: number,
 pipeline?: T,
): ReturnType<T> => {
 const pipe = pipeline || Redis.pipeline();

 pipe.setex(`${prefix}:${key}`, Math.round(expire), 'true');
 pipe.set(`${dataPrefix}:${key}`, value);

 if (pipeline) return pipe as ReturnType<T>;
 return pipe.exec() as ReturnType<T>;
};
