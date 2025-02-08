import type { APIThreadMember } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RThreadMember = Omit<APIThreadMember, 'member'> & {
 guild_id: string;
 user_id: string;
 id: string;
};

export const RThreadMemberKeys = ['id', 'user_id', 'join_timestamp', 'flags', 'guild_id'] as const;

export default class ThreadMemberCache extends Cache<APIThreadMember> {
 public keys = RThreadMemberKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:threadMembers`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIThreadMember, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.redis.set(
   `${this.key()}:${rData.guild_id}:${data.id}:${data.user_id}`,
   JSON.stringify(rData),
  );

  return true;
 }

 get(tId: string, id: string) {
  return this.redis.get(`${this.key()}:${tId}:${id}`).then((data) => this.stringToData(data));
 }

 async del(tId: string, id: string): Promise<number> {
  const keys = await Cache.scanKeys(`${this.key()}:${tId}${id}`);
  return keys.length ? this.redis.del(keys) : 0;
 }

 apiToR(data: APIThreadMember, guildId: string) {
  if (!data.member?.user.id && !data.user_id) return false;
  if (!data.id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RThreadMember;
  rData.user_id = (data.member?.user.id || data.user_id)!;
  rData.guild_id = guildId;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
