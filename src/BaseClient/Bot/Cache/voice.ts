import type { APIVoiceState } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RVoiceState = Omit<APIVoiceState, 'member' | 'guild_id'> & { guild_id: string };

export const RVoiceStateKeys = [
 'guild_id',
 'channel_id',
 'user_id',
 'session_id',
 'deaf',
 'mute',
 'self_deaf',
 'self_mute',
 'self_stream',
 'self_video',
 'suppress',
 'request_to_speak_timestamp',
] as const;

export default class VoiceCache extends Cache<APIVoiceState> {
 public keys = RVoiceStateKeys;

 constructor(redis: Redis) {
  super(redis, 'voices');
 }

 async set(data: APIVoiceState) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.guild_id, rData.user_id]);
  return true;
 }

 apiToR(data: APIVoiceState) {
  if (!data.guild_id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data) as RVoiceState;
 }
}
