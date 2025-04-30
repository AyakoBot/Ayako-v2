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
import RedisClient, { cache as cache } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.ThreadCreate]: (data: GatewayThreadCreateDispatchData) =>
  cache.threads.set(data),

 [GatewayDispatchEvents.ThreadDelete]: async (data: GatewayThreadDeleteDispatchData) => {
  cache.threads.del(data.id);

  const selectPipeline = RedisClient.pipeline();
  selectPipeline.hgetall(cache.threadMembers.keystore(data.guild_id));
  selectPipeline.hgetall(cache.messages.keystore(data.guild_id));
  const result = await selectPipeline.exec();
  if (!result) return;

  const [threadMembers, messages] = result;
  const deletePipeline = RedisClient.pipeline();

  deletePipeline.hdel(
   cache.threadMembers.keystore(data.guild_id),
   ...Object.keys(threadMembers).filter((m) => m.includes(data.id)),
  );
  deletePipeline.del(...Object.keys(threadMembers).filter((m) => m.includes(data.id)));

  deletePipeline.hdel(
   cache.messages.keystore(data.guild_id),
   ...Object.keys(messages).filter((m) => m.includes(data.id)),
  );
  deletePipeline.del(...Object.keys(messages).filter((m) => m.includes(data.id)));

  deletePipeline.exec();
 },

 [GatewayDispatchEvents.ThreadUpdate]: (data: GatewayThreadUpdateDispatchData) =>
  cache.threads.set(data),

 [GatewayDispatchEvents.ThreadListSync]: (data: GatewayThreadListSyncDispatchData) => {
  data.threads.forEach((thread) =>
   cache.threads.set({ ...thread, guild_id: data.guild_id || thread.guild_id }),
  );

  data.members.forEach((threadMember) => {
   cache.threadMembers.set(threadMember, data.guild_id);

   if (!threadMember.member) return;
   cache.members.set(threadMember.member, data.guild_id);
  });
 },

 [GatewayDispatchEvents.ThreadMembersUpdate]: (data: GatewayThreadMembersUpdateDispatchData) => {
  data.added_members?.forEach((threadMember) => {
   cache.threadMembers.set(threadMember, data.guild_id);

   if (!threadMember.member) return;
   cache.members.set(threadMember.member, data.guild_id);
  });

  data.removed_member_ids?.forEach((id) => cache.threadMembers.del(data.id, id));
 },

 [GatewayDispatchEvents.ThreadMemberUpdate]: (data: GatewayThreadMemberUpdateDispatchData) => {
  cache.threadMembers.set(data, data.guild_id);

  if (!data.member) return;
  cache.members.set(data.member, data.guild_id);
 },
} as const;
