import type { APISoundboardSound } from 'discord.js';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RSoundboardSound = Omit<APISoundboardSound, 'user'> & { user_id: string | null };

export const RSoundboardSoundKeys = [
 'name',
 'sound_id',
 'volume',
 'emoji_id',
 'emoji_name',
 'guild_id',
 'available',
 'user_id',
] as const;

export default class SoundboardCache extends Cache<APISoundboardSound> {
 public keys = RSoundboardSoundKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:soundboards`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APISoundboardSound) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${data.sound_id}`, JSON.stringify(rData));

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

 apiToR(data: APISoundboardSound) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RSoundboardSound;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
