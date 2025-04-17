import type { APIBan } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RBan = Omit<APIBan, 'user'> & { user_id: string; guild_id: string };

export const RBanKeys = ['reason', 'user_id', 'guild_id'] as const;

export default class BanCache extends Cache<APIBan> {
 public keys = RBanKeys;

 constructor(redis: Redis) {
  super(redis, 'bans');
 }

 async set(data: APIBan, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  const pipeline = this.redis.pipeline();
  pipeline.set(this.key(rData.guild_id, rData.user_id), JSON.stringify(rData));
  pipeline.hset(this.keystore(rData.guild_id), this.key(rData.guild_id, rData.user_id), 0);
  await pipeline.exec();

  return true;
 }

 apiToR(data: APIBan, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RBan;
  rData.guild_id = guildId;
  rData.user_id = data.user.id;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
