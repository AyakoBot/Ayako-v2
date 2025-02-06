import Redis from '../Bot/Redis.js';

export const prefix = `${process.env.mainId}:ratelimit`;

export default (key: string, expire: number) => Redis.setex(`${prefix}:${key}`, expire, 'true');
