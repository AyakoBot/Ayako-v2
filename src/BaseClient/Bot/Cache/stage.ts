import type { APIStageInstance } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RStageInstance = APIStageInstance;

export const RStageInstanceKeys = [
 'id',
 'guild_id',
 'channel_id',
 'topic',
 'privacy_level',
 'discoverable_disabled',
 'guild_scheduled_event_id',
] as const;

export default class StageCache extends Cache<APIStageInstance> {
 public keys = RStageInstanceKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:stages`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIStageInstance) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${data.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 del(id: string): Promise<number> {
  return this.redis
   .keys(`${this.key()}:${id}`)
   .then((keys) => (keys.length ? this.redis.del(keys) : 0));
 }

 apiToR(data: APIStageInstance) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data);
 }
}
