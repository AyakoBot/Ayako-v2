import Redis from '../Bot/Redis.js';
import { prefix } from './setRatelimit.js';

export default (key: string) => Redis.get(`${prefix}:${key}`);
