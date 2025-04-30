import type { APIAutoModerationRule } from 'discord-api-types/v10';
import Redis from 'ioredis';
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

 constructor(redis: Redis) {
  super(redis, 'automod');
 }

 async set(data: APIAutoModerationRule) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id]);
  return true;
 }

 apiToR(data: APIAutoModerationRule) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);
  return structuredClone(data) as RAutomod;
 }
}
