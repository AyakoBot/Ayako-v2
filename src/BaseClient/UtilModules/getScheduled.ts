import Redis from '../Bot/Redis.js';

export const prefix = `scheduled`;

export default (key: string) => Redis.get(`${prefix}:${key}`);
