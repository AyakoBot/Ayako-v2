import type { APIEmoji } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type REmoji = Omit<APIEmoji, 'user'> & { user_id: string | null; guild_id: string };

export const REmojiKeys = [
 'id',
 'name',
 'animated',
 'roles',
 'user_id',
 'require_colons',
 'managed',
 'guild_id',
] as const;

export default class EmojiCache extends Cache<APIEmoji> {
 public keys = REmojiKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:emojis`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIEmoji, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 async del(id: string): Promise<number> {
  const keys = await Cache.scanKeys(`${this.key()}:${id}`);
  return keys.length ? this.redis.del(keys) : 0;
 }

 apiToR(data: APIEmoji, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as REmoji;
  rData.guild_id = guildId;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData as REmoji;
 }
}
