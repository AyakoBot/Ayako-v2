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

 constructor(redis: Redis) {
  super(redis, 'stages');
 }

 async set(data: APIStageInstance) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id]);
  return true;
 }

 apiToR(data: APIStageInstance) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data);
 }
}
