import type { APIGuildChannel, ChannelType } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RChannelTypes =
 | ChannelType.GuildAnnouncement
 | ChannelType.GuildCategory
 | ChannelType.GuildDirectory
 | ChannelType.GuildForum
 | ChannelType.GuildMedia
 | ChannelType.GuildStageVoice
 | ChannelType.GuildText
 | ChannelType.GuildVoice;

export type RChannel = Omit<APIGuildChannel<RChannelTypes>, 'guild'> & {
 guild_id: string;
};

export const RChannelKeys = [
 'name',
 'id',
 'type',
 'flags',
 'guild_id',
 'permission_overwrites',
 'position',
 'parent_id',
 'nsfw',
 'rate_limit_per_user',
 'default_auto_archive_duration',
 'default_thread_rate_limit_per_user',
 'topic',
 'bitrate',
 'user_limit',
 'rtc_region',
 'video_quality_mode',
 'last_pin_timestamp',
 'available_tags',
 'default_reaction_emoji',
 'default_sort_order',
 'default_forum_layout',
] as (keyof APIGuildChannel<ChannelType.GuildAnnouncement> &
 keyof APIGuildChannel<ChannelType.GuildCategory> &
 keyof APIGuildChannel<ChannelType.GuildDirectory> &
 keyof APIGuildChannel<ChannelType.GuildForum> &
 keyof APIGuildChannel<ChannelType.GuildMedia> &
 keyof APIGuildChannel<ChannelType.GuildStageVoice> &
 keyof APIGuildChannel<ChannelType.GuildText> &
 keyof APIGuildChannel<ChannelType.GuildVoice>)[];

export default class ChannelCache extends Cache<
 APIGuildChannel<RChannelTypes> & { guild_id: string }
> {
 public keys = RChannelKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:channels`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIGuildChannel<RChannelTypes>) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${data.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 del(id: string): Promise<number> {
  return this.redis
   .keys(`${this.key()}:${id}`)
   .then((keys) => (keys.length ? this.redis.del(keys) : 0));
 }

 apiToR(data: APIGuildChannel<RChannelTypes>) {
  if (!data.guild_id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RChannel;
  rData.guild_id = data.guild_id;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
