import type { APIExtendedInvite, APIInvite } from 'discord-api-types/v10';
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
 uses: number | null;
 max_uses: number | null;
 max_age: number | null;
 temporary: boolean | null;
 created_at: string | null;
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
 'uses',
 'max_uses',
 'max_age',
 'temporary',
 'created_at',
] as const;

export default class InviteCache extends Cache<APIInvite> {
 public keys = RInviteKeys;

 constructor(redis: Redis) {
  super(redis, 'invites');
 }

 async set(data: APIInvite) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.code]);
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
  rData.uses = 'uses' in data && data.uses ? data.uses : null;
  rData.max_uses = 'max_uses' in data && data.max_uses ? data.max_uses : null;
  rData.max_age = 'max_age' in data && data.max_age ? data.max_age : null;
  rData.temporary = 'temporary' in data && data.temporary ? data.temporary : null;
  rData.created_at = 'created_at' in data && data.created_at ? data.created_at : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
