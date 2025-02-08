/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayMessageCreateDispatchData,
 type GatewayMessageDeleteBulkDispatchData,
 type GatewayMessageDeleteDispatchData,
 type GatewayMessagePollVoteDispatchData,
 type GatewayMessageReactionAddDispatchData,
 type GatewayMessageReactionRemoveAllDispatchData,
 type GatewayMessageReactionRemoveDispatchData,
 type GatewayMessageReactionRemoveEmojiDispatchData,
 type GatewayMessageUpdateDispatchData,
} from 'discord.js';
import RedisClient, { cache as redis } from '../../../../BaseClient/Bot/Redis.js';
import scanKeys from '../../../../BaseClient/UtilModules/scanKeys.js';
import { AllThreadGuildChannelTypes } from '../../../../Typings/Channel.js';

export default {
 [GatewayDispatchEvents.MessageCreate]: async (data: GatewayMessageCreateDispatchData) => {
  if (data.guild_id) redis.messages.set(data, data.guild_id);

  if (!data.webhook_id) redis.users.set(data.author);

  if (!AllThreadGuildChannelTypes.includes(data.type)) return;

  const cache = await redis.threads.get(data.channel_id);
  if (cache) redis.threads.set({ ...cache, message_count: (cache.message_count || 0) + 1 });
 },

 [GatewayDispatchEvents.MessageDelete]: (data: GatewayMessageDeleteDispatchData) =>
  redis.messages.del(data.id),

 [GatewayDispatchEvents.MessageDeleteBulk]: (data: GatewayMessageDeleteBulkDispatchData) =>
  data.ids.forEach((id) => redis.messages.del(id)),

 [GatewayDispatchEvents.MessageUpdate]: (data: GatewayMessageUpdateDispatchData) => {
  if (data.guild_id) redis.messages.set(data, data.guild_id);
 },

 [GatewayDispatchEvents.MessagePollVoteAdd]: (_: GatewayMessagePollVoteDispatchData) => undefined,

 [GatewayDispatchEvents.MessagePollVoteRemove]: (_: GatewayMessagePollVoteDispatchData) =>
  undefined,

 [GatewayDispatchEvents.MessageReactionAdd]: async (
  data: GatewayMessageReactionAddDispatchData,
 ) => {
  if (data.member && data.guild_id) redis.members.set(data.member, data.guild_id);

  if (data.member?.user) redis.users.set(data.member.user);

  if (!data.guild_id) return;

  const cache = await redis.reactions.get(data.message_id, (data.emoji.id || data.emoji.name)!);

  redis.reactions.set(
   {
    burst_colors: data.burst_colors,
    emoji: data.emoji,
    me: cache?.me || false,
    count_details: cache?.count_details
     ? {
        burst: cache.count_details.burst + (data.burst ? 1 : 0),
        normal: cache.count_details.normal + (data.burst ? 0 : 1),
       }
     : { burst: data.burst ? 1 : 0, normal: data.burst ? 0 : 1 },
    count: cache?.count ? cache.count + 1 : 1,
    me_burst: cache?.me_burst || data.user_id === process.env.mainId ? data.burst : false,
   },
   data.guild_id,
   data.channel_id,
   data.message_id,
  );
 },

 [GatewayDispatchEvents.MessageReactionRemove]: async (
  data: GatewayMessageReactionRemoveDispatchData,
 ) => {
  if (!data.guild_id) return;

  const cache = await redis.reactions.get(data.message_id, (data.emoji.id || data.emoji.name)!);

  redis.reactions.set(
   {
    burst_colors: cache?.burst_colors || [],
    emoji: data.emoji,
    me: cache?.me || false,
    count_details: cache?.count_details
     ? {
        burst: cache.count_details.burst - (data.burst ? 1 : 0),
        normal: cache.count_details.normal - (data.burst ? 0 : 1),
       }
     : { burst: 0, normal: 0 },
    count: cache?.count ? cache.count - 1 : 0,
    me_burst: cache?.me_burst || data.user_id === process.env.mainId ? data.burst : false,
   },
   data.guild_id,
   data.channel_id,
   data.message_id,
  );
 },

 [GatewayDispatchEvents.MessageReactionRemoveAll]: (
  data: GatewayMessageReactionRemoveAllDispatchData,
 ) =>
  scanKeys(`${redis.reactions.key()}:*:${data.message_id}:*`).then((r) =>
   r.length ? RedisClient.del(r) : 0,
  ),

 [GatewayDispatchEvents.MessageReactionRemoveEmoji]: (
  data: GatewayMessageReactionRemoveEmojiDispatchData,
 ) =>
  scanKeys(
   `${redis.reactions.key()}:*:${data.message_id}:${data.emoji.id || data.emoji.name}`,
  ).then((r) => (r.length ? RedisClient.del(r) : 0)),
} as const;
