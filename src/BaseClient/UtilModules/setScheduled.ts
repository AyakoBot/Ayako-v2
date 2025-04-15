import Redis from '../Bot/Redis.js';
import { prefix } from './getScheduled.js';

export const dataPrefix = `${process.env.mainId}:scheduled-data`;

export default (key: string, value: string, expire: number) => {
 Redis.setex(`${prefix}:${key}`, Math.round(expire), 'true');
 Redis.set(`${dataPrefix}:${key}`, value);
};
