import type { APISticker } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import type { MakeRequired } from 'src/Typings/Typings';
import Cache from './base.js';

export type RSticker = MakeRequired<APISticker, 'guild_id'> & { user_id: string | null };

export const RStickerKeys = [
 'id',
 'pack_id',
 'name',
 'description',
 'tags',
 'type',
 'format_type',
 'available',
 'guild_id',
 'sort_value',
] as const;

export default class StickerCache extends Cache<APISticker> {
 public keys = RStickerKeys;

 constructor(redis: Redis) {
  super(redis, 'stickers');
 }

 async set(data: APISticker) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id]);
  return true;
 }

 apiToR(data: APISticker) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RSticker;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as unknown as Record<string, unknown>)[k as string]);

  return rData;
 }
}
