import type { APIInvite } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RInvite = Omit<
 APIInvite,
 'guild' | 'channel' | 'inviter' | 'target_user' | 'guild_scheduled_event' | 'stage_instance'
> & {
 guild_id: string;
 channel_id: string | null;
 inviter_id: string | null;
 target_user_id: string | null;
 guild_scheduled_event_id: string | null;
 application_id: string | null;
};

export const RInviteKeys = [
 'code',
 'target_type',
 'approximate_presence_count',
 'approximate_member_count',
 'expires_at',
 'type',
 'guild_id',
 'channel_id',
 'inviter_id',
 'target_user_id',
 'guild_scheduled_event_id',
 'application_id',
] as const;

export default class InviteCache extends Cache<APIInvite> {
 public keys = RInviteKeys;

 constructor(redis: Redis) {
  super(redis, 'invites');
 }

 async set(data: APIInvite) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  const pipeline = this.redis.pipeline();
  pipeline.set(this.key(rData.guild_id, rData.code), JSON.stringify(rData));
  pipeline.hset(this.keystore(rData.guild_id), this.key(rData.code), 0);
  await pipeline.exec();

  return true;
 }

 apiToR(data: APIInvite) {
  if (!data.guild) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RInvite;
  rData.guild_id = data.guild.id;
  rData.channel_id = data.channel?.id || null;
  rData.inviter_id = data.inviter?.id || null;
  rData.guild_scheduled_event_id = data.guild_scheduled_event?.id || null;
  rData.application_id = data.target_application?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
