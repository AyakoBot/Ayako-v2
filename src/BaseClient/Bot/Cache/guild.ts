import type { APIGuild } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RGuild = Omit<
 APIGuild,
 'roles' | 'emojis' | 'stickers' | 'icon_hash' | 'discovery_splash' | 'banner'
> & {
 roles: string[];
 emojis: string[];
 stickers: string[];
 icon_url: string | null;
 discovery_splash_url: string | null;
 banner_url: string | null;
};

export const RGuildKeys = [
 'afk_channel_id',
 'afk_timeout',
 'application_id',
 'approximate_member_count',
 'approximate_presence_count',
 'default_message_notifications',
 'description',
 'emojis',
 'explicit_content_filter',
 'features',
 'hub_type',
 'icon',
 'id',
 'incidents_data',
 'max_members',
 'max_presences',
 'max_stage_video_channel_users',
 'max_video_channel_users',
 'mfa_level',
 'name',
 'nsfw_level',
 'owner',
 'owner_id',
 'permissions',
 'preferred_locale',
 'premium_progress_bar_enabled',
 'premium_subscription_count',
 'premium_tier',
 'public_updates_channel_id',
 'region',
 'roles',
 'rules_channel_id',
 'safety_alerts_channel_id',
 'splash',
 'stickers',
 'system_channel_flags',
 'system_channel_id',
 'vanity_url_code',
 'verification_level',
 'welcome_screen',
 'widget_channel_id',
 'widget_enabled',
 'icon_url',
 'discovery_splash_url',
 'banner_url',
] as const;

export default class GuildCache extends Cache<APIGuild> {
 public keys = RGuildKeys;

 public static getIconUrl(hash: string, guildId: string) {
  return `https://cdn.discordapp.com/icons/${guildId}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 public static getPublicSplashUrl(hash: string, guildId: string) {
  return `https://cdn.discordapp.com/discovery-splashes/${guildId}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 public static getBannerUrl(hash: string, guildId: string) {
  return `https://cdn.discordapp.com/banners/${guildId}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 constructor(redis: Redis) {
  super(redis, 'guilds');
 }

 async set(data: APIGuild) {
  const rData = this.apiToR(data);
  if (!rData) return false;
  if (!rData.id) return false;

  await this.setValue(rData, [], [rData.id]);
  return true;
 }

 apiToR(data: APIGuild) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RGuild;
  rData.roles = data.roles.map((r) => r.id);
  rData.emojis = data.emojis.map((e) => e.id).filter((e): e is string => !!e);
  rData.stickers = data.stickers.map((s) => s.id);
  rData.icon_url = data.icon ? GuildCache.getIconUrl(data.icon, data.id) : null;
  rData.discovery_splash_url = data.discovery_splash
   ? GuildCache.getPublicSplashUrl(data.discovery_splash, data.id)
   : null;
  rData.banner_url = data.banner ? GuildCache.getBannerUrl(data.banner, data.id) : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
