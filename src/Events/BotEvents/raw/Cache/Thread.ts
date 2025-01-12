/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayThreadCreateDispatchData,
 type GatewayThreadDeleteDispatchData,
 type GatewayThreadListSyncDispatchData,
 type GatewayThreadMembersUpdateDispatchData,
 type GatewayThreadMemberUpdateDispatchData,
 type GatewayThreadUpdateDispatchData,
} from 'discord.js';
import RedisClient, { cache as redis } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.ThreadCreate]: (data: GatewayThreadCreateDispatchData) =>
  redis.threads.set(data),

 [GatewayDispatchEvents.ThreadDelete]: (data: GatewayThreadDeleteDispatchData) => {
  redis.threads.del(data.id);

  RedisClient.keys(`${redis.messages.key}:${data.guild_id}:${data.id}:*`).then((keys) =>
   keys.length ? RedisClient.del(keys) : 0,
  );

  RedisClient.keys(`${redis.threadMembers.key}:${data.guild_id}:${data.id}:*`).then((keys) =>
   keys.length ? RedisClient.del(keys) : 0,
  );
 },

 [GatewayDispatchEvents.ThreadUpdate]: (data: GatewayThreadUpdateDispatchData) =>
  redis.threads.set(data),

 [GatewayDispatchEvents.ThreadListSync]: (data: GatewayThreadListSyncDispatchData) => {
  data.threads.forEach((thread) =>
   redis.threads.set({ ...thread, guild_id: data.guild_id || thread.guild_id }),
  );

  data.members.forEach((threadMember) => {
   redis.threadMembers.set(threadMember, data.guild_id);

   if (!threadMember.member) return;
   redis.members.set(threadMember.member, data.guild_id);
  });
 },

 [GatewayDispatchEvents.ThreadMembersUpdate]: (data: GatewayThreadMembersUpdateDispatchData) => {
  data.added_members?.forEach((threadMember) => {
   redis.threadMembers.set(threadMember, data.guild_id);

   if (!threadMember.member) return;
   redis.members.set(threadMember.member, data.guild_id);
  });

  data.removed_member_ids?.forEach((id) => redis.threadMembers.del(data.id, id));
 },

 [GatewayDispatchEvents.ThreadMemberUpdate]: (data: GatewayThreadMemberUpdateDispatchData) => {
  redis.threadMembers.set(data, data.guild_id);

  if (!data.member) return;
  redis.members.set(data.member, data.guild_id);
 },
} as const;
