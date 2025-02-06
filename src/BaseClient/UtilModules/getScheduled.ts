import Redis from '../Bot/Redis.js';

export const prefix = `${process.env.mainId}:scheduled`;

export default (key: string) => Redis.get(`${prefix}:${key}`);
