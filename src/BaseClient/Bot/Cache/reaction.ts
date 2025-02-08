import type { APIReaction } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RReaction = APIReaction & { guild_id: string; channe_id: string; message_id: string };

export const RReactionKeys = [
 'count',
 'count_details',
 'me',
 'me_burst',
 'emoji',
 'burst_colors',
 'guild_id',
 'message_id',
] as const;

export default class ReactionCache extends Cache<APIReaction> {
 public keys = RReactionKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:reactions`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIReaction, guildId: string, channelId: string, messageId: string) {
  const rData = this.apiToR(data, guildId, channelId, messageId);
  if (!rData) return false;

  await this.redis.set(
   `${this.key()}:${rData.guild_id}:${rData.message_id}:${data.emoji.id || data.emoji.name}`,
   JSON.stringify(rData),
  );

  return true;
 }

 get(mId: string, eId: string) {
  return this.redis.get(`${this.key()}:${mId}:${eId}`).then((data) => this.stringToData(data));
 }

 async del(mId: string, eId: string): Promise<number> {
  const keys = await Cache.scanKeys(`${this.key()}:${mId}:${eId}`);
  return keys.length ? this.redis.del(keys) : 0;
 }

 apiToR(data: APIReaction, guildId: string, channelId: string, messageId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RReaction;
  rData.guild_id = guildId;
  rData.channe_id = channelId;
  rData.message_id = messageId;

  keysNotToCache.forEach((k) => delete (rData as unknown as Record<string, unknown>)[k as string]);

  return rData;
 }
}
