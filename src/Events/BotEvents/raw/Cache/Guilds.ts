/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 GuildMemberFlagsBitField,
 type APIGuildMember,
 type GatewayGuildAuditLogEntryCreateDispatchData,
 type GatewayGuildBanAddDispatchData,
 type GatewayGuildBanRemoveDispatchData,
 type GatewayGuildCreateDispatchData,
 type GatewayGuildDeleteDispatchData,
 type GatewayGuildEmojisUpdateDispatchData,
 type GatewayGuildIntegrationsUpdateDispatchData,
 type GatewayGuildMemberAddDispatchData,
 type GatewayGuildMemberRemoveDispatchData,
 type GatewayGuildMembersChunkDispatchData,
 type GatewayGuildMemberUpdateDispatchData,
 type GatewayGuildRoleCreateDispatchData,
 type GatewayGuildScheduledEventCreateDispatchData,
 type GatewayGuildScheduledEventDeleteDispatchData,
 type GatewayGuildScheduledEventUpdateDispatchData,
 type GatewayGuildScheduledEventUserAddDispatchData,
 type GatewayGuildScheduledEventUserRemoveDispatchData,
 type GatewayGuildSoundboardSoundCreateDispatchData,
 type GatewayGuildSoundboardSoundDeleteDispatchData,
 type GatewayGuildSoundboardSoundsUpdateDispatchData,
 type GatewayGuildSoundboardSoundUpdateDispatchData,
 type GatewayGuildStickersUpdateDispatchData,
 type GatewayGuildUpdateDispatchData,
} from 'discord.js';
import RedisClient, { cache as redis } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.GuildAuditLogEntryCreate]: (
  _: GatewayGuildAuditLogEntryCreateDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.GuildBanAdd]: (data: GatewayGuildBanAddDispatchData) => {
  redis.bans.set({ reason: '-', user: data.user }, data.guild_id);
  redis.users.set(data.user);
 },
 [GatewayDispatchEvents.GuildBanRemove]: (data: GatewayGuildBanRemoveDispatchData) => {
  redis.bans.del(data.guild_id, data.user.id);
  redis.users.set(data.user);
 },

 [GatewayDispatchEvents.GuildCreate]: (data: GatewayGuildCreateDispatchData) => {
  if (data.unavailable) return;
  if ('geo_restricted' in data && data.geo_restricted) return;

  redis.guilds.set(data);
  data.soundboard_sounds.forEach((sound) => redis.soundboards.set({ ...sound, guild_id: data.id }));
  data.emojis.forEach((emoji) => redis.emojis.set(emoji, data.id));
  data.threads.forEach((thread) => redis.threads.set({ ...thread, guild_id: data.id }));
  data.guild_scheduled_events.forEach((event) => redis.events.set(event));
  data.roles.forEach((role) => redis.roles.set(role, data.id));
  data.members.forEach((member) => redis.members.set(member, data.id));
  data.members.forEach((member) => redis.users.set(member.user));
  data.voice_states.forEach((voice) => redis.voices.set({ ...voice, guild_id: data.id }));
  data.channels.forEach((channel) => redis.channels.set({ ...channel, guild_id: data.id }));
  data.stickers.forEach((sticker) => redis.stickers.set({ ...sticker, guild_id: data.id }));
 },

 [GatewayDispatchEvents.GuildDelete]: async (data: GatewayGuildDeleteDispatchData) => {
  const getPipeline = RedisClient.pipeline();

  // Add all hgetall commands to the pipeline
  getPipeline.hgetall(redis.automods.keystore(data.id));
  getPipeline.hgetall(redis.bans.keystore(data.id));
  getPipeline.hgetall(redis.channels.keystore(data.id));
  getPipeline.hgetall(redis.commandPermissions.keystore(data.id));
  getPipeline.hgetall(redis.emojis.keystore(data.id));
  getPipeline.hgetall(redis.events.keystore(data.id));
  getPipeline.hgetall(redis.guildCommands.keystore(data.id));
  getPipeline.hgetall(redis.integrations.keystore(data.id));
  getPipeline.hgetall(redis.invites.keystore(data.id));
  getPipeline.hgetall(redis.members.keystore(data.id));
  getPipeline.hgetall(redis.messages.keystore(data.id));
  getPipeline.hgetall(redis.reactions.keystore(data.id));
  getPipeline.hgetall(redis.roles.keystore(data.id));
  getPipeline.hgetall(redis.soundboards.keystore(data.id));
  getPipeline.hgetall(redis.stages.keystore(data.id));
  getPipeline.hgetall(redis.stickers.keystore(data.id));
  getPipeline.hgetall(redis.threads.keystore(data.id));
  getPipeline.hgetall(redis.threadMembers.keystore(data.id));
  getPipeline.hgetall(redis.voices.keystore(data.id));
  getPipeline.hgetall(redis.webhooks.keystore(data.id));

  const results = await getPipeline.exec();
  if (!results) return;

  const [
   automods,
   bans,
   channels,
   commandPermissions,
   emojis,
   events,
   guildCommands,
   integrations,
   invites,
   members,
   messages,
   reactions,
   roles,
   soundboards,
   stages,
   stickers,
   threads,
   threadMembers,
   voices,
   webhooks,
  ] = results.map((result) => result[1] || {});

  const deletePipeline = RedisClient.pipeline();
  deletePipeline.del(redis.guilds.keystore(data.id));
  deletePipeline.del(redis.automods.keystore(data.id));
  deletePipeline.del(redis.bans.keystore(data.id));
  deletePipeline.del(redis.channels.keystore(data.id));
  deletePipeline.del(redis.commandPermissions.keystore(data.id));
  deletePipeline.del(redis.emojis.keystore(data.id));
  deletePipeline.del(redis.events.keystore(data.id));
  deletePipeline.del(redis.guildCommands.keystore(data.id));
  deletePipeline.del(redis.integrations.keystore(data.id));
  deletePipeline.del(redis.invites.keystore(data.id));
  deletePipeline.del(redis.members.keystore(data.id));
  deletePipeline.del(redis.messages.keystore(data.id));
  deletePipeline.del(redis.reactions.keystore(data.id));
  deletePipeline.del(redis.roles.keystore(data.id));
  deletePipeline.del(redis.soundboards.keystore(data.id));
  deletePipeline.del(redis.stages.keystore(data.id));
  deletePipeline.del(redis.stickers.keystore(data.id));
  deletePipeline.del(redis.threads.keystore(data.id));
  deletePipeline.del(redis.threadMembers.keystore(data.id));
  deletePipeline.del(redis.voices.keystore(data.id));
  deletePipeline.del(redis.webhooks.keystore(data.id));

  deletePipeline.del(...Object.keys(automods));
  deletePipeline.del(...Object.keys(bans));
  deletePipeline.del(...Object.keys(channels));
  deletePipeline.del(...Object.keys(commandPermissions));
  deletePipeline.del(...Object.keys(emojis));
  deletePipeline.del(...Object.keys(events));
  deletePipeline.del(...Object.keys(guildCommands));
  deletePipeline.del(...Object.keys(integrations));
  deletePipeline.del(...Object.keys(invites));
  deletePipeline.del(...Object.keys(members));
  deletePipeline.del(...Object.keys(messages));
  deletePipeline.del(...Object.keys(reactions));
  deletePipeline.del(...Object.keys(roles));
  deletePipeline.del(...Object.keys(soundboards));
  deletePipeline.del(...Object.keys(stages));
  deletePipeline.del(...Object.keys(stickers));
  deletePipeline.del(...Object.keys(threads));
  deletePipeline.del(...Object.keys(threadMembers));
  deletePipeline.del(...Object.keys(voices));
  deletePipeline.del(...Object.keys(webhooks));

  await deletePipeline.exec();
 },

 [GatewayDispatchEvents.GuildUpdate]: (data: GatewayGuildUpdateDispatchData) =>
  redis.guilds.set(data),

 [GatewayDispatchEvents.GuildEmojisUpdate]: async (data: GatewayGuildEmojisUpdateDispatchData) => {
  const emojis = await RedisClient.hgetall(redis.emojis.keystore(data.guild_id));
  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(emojis));
  pipeline.del(redis.stickers.keystore(data.guild_id));
  await pipeline.exec();

  data.emojis.forEach((emoji) => redis.emojis.set(emoji, data.guild_id));
 },

 [GatewayDispatchEvents.GuildIntegrationsUpdate]: (_: GatewayGuildIntegrationsUpdateDispatchData) =>
  undefined,

 [GatewayDispatchEvents.GuildMemberAdd]: (data: GatewayGuildMemberAddDispatchData) => {
  redis.members.set(data, data.guild_id);

  redis.users.set(data.user);
 },

 [GatewayDispatchEvents.GuildMemberRemove]: (data: GatewayGuildMemberRemoveDispatchData) => {
  redis.members.del(data.guild_id, data.user.id);

  redis.users.set(data.user);
 },

 [GatewayDispatchEvents.GuildMembersChunk]: (data: GatewayGuildMembersChunkDispatchData) =>
  data.members.forEach((member) => redis.members.set(member, data.guild_id)),

 [GatewayDispatchEvents.GuildMemberUpdate]: async (data: GatewayGuildMemberUpdateDispatchData) => {
  if (data.joined_at && data.deaf && data.mute) {
   redis.members.set(data as Parameters<typeof redis.members.set>[0], data.guild_id);
   return;
  }

  const member = await RedisClient.get(
   `${redis.members.key()}:${data.guild_id}:${data.user.id}`,
  ).then((r) => (r ? (JSON.parse(r) as APIGuildMember) : null));
  if (!member) {
   redis.members.set(
    {
     ...data,
     joined_at: data.joined_at || new Date().toISOString(),
     mute: data.mute || false,
     deaf: data.deaf || false,
     flags: data.flags || new GuildMemberFlagsBitField().bitfield,
    },
    data.guild_id,
   );
   return;
  }

  const mergedMember = { ...data };

  if (!data.user) return;
  redis.members.set(
   {
    ...mergedMember,
    deaf: mergedMember.deaf || false,
    mute: mergedMember.mute || false,
    flags: mergedMember.flags || new GuildMemberFlagsBitField().bitfield,
    joined_at: mergedMember.joined_at || new Date().toISOString(),
   },
   data.guild_id,
  );
 },

 [GatewayDispatchEvents.GuildRoleCreate]: (data: GatewayGuildRoleCreateDispatchData) =>
  redis.roles.set(data.role, data.guild_id),

 [GatewayDispatchEvents.GuildRoleDelete]: (data: GatewayGuildRoleCreateDispatchData) =>
  data.role ? redis.roles.del(data.role.id) : undefined,

 [GatewayDispatchEvents.GuildRoleUpdate]: (data: GatewayGuildRoleCreateDispatchData) =>
  redis.roles.set(data.role, data.guild_id),

 [GatewayDispatchEvents.GuildScheduledEventCreate]: (
  data: GatewayGuildScheduledEventCreateDispatchData,
 ) => redis.events.set(data),

 [GatewayDispatchEvents.GuildScheduledEventDelete]: (
  data: GatewayGuildScheduledEventDeleteDispatchData,
 ) => redis.events.del(data.id),

 [GatewayDispatchEvents.GuildScheduledEventUpdate]: (
  data: GatewayGuildScheduledEventUpdateDispatchData,
 ) => redis.events.set(data),

 [GatewayDispatchEvents.GuildScheduledEventUserAdd]: (
  _: GatewayGuildScheduledEventUserAddDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.GuildScheduledEventUserRemove]: (
  _: GatewayGuildScheduledEventUserRemoveDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.GuildSoundboardSoundCreate]: (
  data: GatewayGuildSoundboardSoundCreateDispatchData,
 ) => (data.guild_id ? redis.soundboards.set(data) : undefined),

 [GatewayDispatchEvents.GuildSoundboardSoundDelete]: (
  data: GatewayGuildSoundboardSoundDeleteDispatchData,
 ) => redis.soundboards.del(data.sound_id),

 [GatewayDispatchEvents.GuildSoundboardSoundUpdate]: (
  data: GatewayGuildSoundboardSoundUpdateDispatchData,
 ) => (data.guild_id ? redis.soundboards.set(data) : undefined),

 [GatewayDispatchEvents.GuildSoundboardSoundsUpdate]: async (
  data: GatewayGuildSoundboardSoundsUpdateDispatchData,
 ) => {
  const sounds = await RedisClient.hgetall(redis.soundboards.keystore(data.guild_id));
  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(sounds));
  pipeline.del(redis.soundboards.keystore(data.guild_id));
  await pipeline.exec();

  data.soundboard_sounds.forEach((sound) =>
   redis.soundboards.set({ ...sound, guild_id: data.guild_id }),
  );
 },

 [GatewayDispatchEvents.GuildStickersUpdate]: async (
  data: GatewayGuildStickersUpdateDispatchData,
 ) => {
  const stickers = await RedisClient.hgetall(redis.stickers.keystore(data.guild_id));
  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(stickers));
  pipeline.del(redis.stickers.keystore(data.guild_id));
  await pipeline.exec();

  data.stickers.forEach((sticker) => redis.stickers.set({ ...sticker, guild_id: data.guild_id }));
 },
} as const;
