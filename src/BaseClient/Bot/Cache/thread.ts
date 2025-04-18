import type { APIThreadChannel } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RThread = Pick<
 APIThreadChannel,
 | 'id'
 | 'name'
 | 'type'
 | 'flags'
 | 'last_message_id'
 | 'last_pin_timestamp'
 | 'rate_limit_per_user'
 | 'owner_id'
 | 'thread_metadata'
 | 'message_count'
 | 'member_count'
 | 'total_message_sent'
 | 'applied_tags'
> & {
 guild_id: string;
 member_id: string | null;
};

export const RThreadKeys = [
 'id',
 'name',
 'type',
 'flags',
 'last_message_id',
 'last_pin_timestamp',
 'rate_limit_per_user',
 'owner_id',
 'thread_metadata',
 'message_count',
 'member_count',
 'total_message_sent',
 'applied_tags',
 'guild_id',
 'member_id',
] as const;

export default class ThreadCache extends Cache<
 APIThreadChannel & { guild_id: string; member_id: string },
 true
> {
 public keys = RThreadKeys;

 constructor(redis: Redis) {
  super(redis, 'threads');
 }

 async set(data: Omit<APIThreadChannel, 'position'>) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id]);
  return true;
 }

 apiToR(data: Omit<APIThreadChannel, 'position'>) {
  if (!data.guild_id) return false;
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RThread;
  rData.member_id = data.member?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
