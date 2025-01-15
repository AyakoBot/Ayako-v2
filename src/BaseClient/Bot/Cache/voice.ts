import type { APIVoiceState } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import type { MakeRequired } from 'src/Typings/Typings';
import Cache from './base.js';

export type RVoiceState = MakeRequired<Omit<APIVoiceState, 'member'>, 'guild_id'>;

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

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:voices`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIVoiceState) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${data.guild_id}:${data.user_id}`, JSON.stringify(rData));

  return true;
 }

 get(gId: string, id: string) {
  return this.redis.get(`${this.key()}:${gId}:${id}`).then((data) => this.stringToData(data));
 }

 del(gId: string, id: string): Promise<number> {
  return this.redis.del(`${this.key()}:${gId}:${id}`);
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
