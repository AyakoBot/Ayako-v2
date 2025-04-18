import type { APIMessage, APIMessageSnapshotFields } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RMessage = Omit<
 APIMessage,
 | 'application'
 | 'author'
 | 'mentions'
 | 'thread'
 | 'resolved'
 | 'message_snapshots'
 | 'stickers'
 | 'application_id'
> & {
 author_id: string;
 guild_id: string;
 application_id: string | null;
 mention_users: string[];
 thread_id: string | null;
 message_snapshots: Omit<APIMessageSnapshotFields, 'stickers'>[] | null;
};

export const RMessageKeys = [
 'id',
 'channel_id',
 'author_id',
 'guild_id',
 'content',
 'timestamp',
 'edited_timestamp',
 'tts',
 'mention_everyone',
 'mention_users',
 'mention_roles',
 'mention_channels',
 'attachments',
 'reactions',
 'embeds',
 'pinned',
 'webhook_id',
 'type',
 'activity',
 'application_id',
 'message_reference',
 'flags',
 'referenced_message',
 'thread_id',
 'components',
 'sticker_items',
 'position',
 'role_subscription_data',
 'poll',
 'message_snapshots',
] as const;

export default class MessageCache extends Cache<APIMessage> {
 public keys = RMessageKeys;

 constructor(redis: Redis) {
  super(redis, 'messages');
 }

 async set(data: APIMessage, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.channel_id, rData.id], 1209600);
  return true;
 }

 apiToR(data: APIMessage, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RMessage;
  rData.guild_id = guildId;
  rData.author_id = data.author.id;
  rData.application_id = data.application_id || data.application?.id || null;
  rData.mention_users = data.mentions.map((u) => u.id);
  rData.thread_id = data.thread?.id || null;
  rData.message_snapshots =
   data.message_snapshots?.map((s) => {
    const rS = structuredClone(s) as unknown as NonNullable<RMessage['message_snapshots']>[number];
    delete (rS as APIMessage).stickers;

    return rS;
   }) || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
