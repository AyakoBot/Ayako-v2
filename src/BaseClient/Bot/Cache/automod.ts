import type { APIAutoModerationRule } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RAutomod = APIAutoModerationRule;

export const RAutomodKeys = [
 'id',
 'guild_id',
 'name',
 'creator_id',
 'event_type',
 'trigger_type',
 'trigger_metadata',
 'actions',
 'enabled',
 'exempt_roles',
 'exempt_channels',
] as const;

export default class AutomodCache extends Cache<APIAutoModerationRule> {
 public keys = RAutomodKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:automod`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIAutoModerationRule) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${rData.id}`, JSON.stringify(rData));

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

 apiToR(data: APIAutoModerationRule) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);
  return structuredClone(data) as RAutomod;
 }
}
