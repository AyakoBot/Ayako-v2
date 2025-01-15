import type { APIGuildMember } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RMember = Omit<APIGuildMember, 'user' | 'avatar' | 'banner'> & {
 user_id: string;
 guild_id: string;
 avatar_url: string | null;
 banner_url: string | null;
};

export const RMemberKeys = [
 'user_id',
 'nick',
 'avatar_url',
 'banner_url',
 'roles',
 'joined_at',
 'premium_since',
 'deaf',
 'mute',
 'flags',
 'pending',
 'communication_disabled_until',
 'avatar_decoration_data',
 'guild_id',
] as const;

export default class MemberCache extends Cache<APIGuildMember> {
 public keys = RMemberKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:members`, redis);
 }

 public static bannerUrl(banner: string, userId: string, guildId: string) {
  return `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/banners/${banner}.${banner.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 public static avatarUrl(avatar: string, userId: string, guildId: string) {
  return `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/avatars/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 key() {
  return this.prefix;
 }

 async set(data: APIGuildMember, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${rData.user_id}`, JSON.stringify(rData));

  return true;
 }

 get(gId: string, id: string) {
  return this.redis.get(`${this.key()}:${gId}:${id}`).then((data) => this.stringToData(data));
 }

 del(gId: string, id: string): Promise<number> {
  return this.redis.del(`${this.key()}:${gId}:${id}`);
 }

 apiToR(data: APIGuildMember, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RMember;
  rData.guild_id = guildId;
  rData.user_id = data.user.id;
  rData.avatar_url = data.avatar ? MemberCache.avatarUrl(data.avatar, data.user.id, guildId) : null;
  rData.banner_url = data.banner ? MemberCache.bannerUrl(data.banner, data.user.id, guildId) : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
