import { type APIWebhook } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RWebhook = Omit<APIWebhook, 'user' | 'avatar' | 'guild_id'> & {
 user_id: string | null;
 avatar_url: string | null;
 guild_id: string;
};

export const RWebhookKeys = [
 'id',
 'type',
 'guild_id',
 'channel_id',
 'user_id',
 'name',
 'avatar_url',
 'token',
 'application_id',
 'source_guild',
 'source_channel',
 'url',
] as const;

export default class WebhookCache extends Cache<
 APIWebhook & { user_id: string | null; avatar_url: string | null }
> {
 public keys = RWebhookKeys;

 constructor(redis: Redis) {
  super(redis, 'webhooks');
 }

 public static avatarUrl(avatar: string, webhookId: string) {
  return `https://cdn.discordapp.com/avatars/${webhookId}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 async set(data: APIWebhook) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.guild_id, rData.id]);
  return true;
 }

 apiToR(data: APIWebhook) {
  if (!data.guild_id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RWebhook;
  rData.user_id = data.user?.id || null;
  rData.avatar_url = data.avatar ? WebhookCache.avatarUrl(data.avatar, data.id) : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
