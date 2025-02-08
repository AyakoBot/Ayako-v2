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
import RedisClient, {
 cache as redis,
 prefix as redisKey,
} from '../../../../BaseClient/Bot/Redis.js';
import scanKeys from '../../../../BaseClient/UtilModules/scanKeys.js';

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

 [GatewayDispatchEvents.GuildDelete]: (data: GatewayGuildDeleteDispatchData) =>
  scanKeys(`${redisKey}:${data.id}:*`).then((r) => (r.length ? RedisClient.del(r) : 0)),

 [GatewayDispatchEvents.GuildUpdate]: (data: GatewayGuildUpdateDispatchData) =>
  redis.guilds.set(data),

 [GatewayDispatchEvents.GuildEmojisUpdate]: async (data: GatewayGuildEmojisUpdateDispatchData) => {
  await scanKeys(`${redis.emojis.key()}:${data.guild_id}:*`).then((r) =>
   r.length ? RedisClient.del(r) : 0,
  );

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
  await scanKeys(`${redis.soundboards.key()}:${data.guild_id}:*`).then((r) =>
   r.length ? RedisClient.del(r) : 0,
  );

  data.soundboard_sounds.forEach((sound) =>
   redis.soundboards.set({ ...sound, guild_id: data.guild_id }),
  );
 },

 [GatewayDispatchEvents.GuildStickersUpdate]: async (
  data: GatewayGuildStickersUpdateDispatchData,
 ) => {
  await scanKeys(`${redis.stickers.key()}:${data.guild_id}:*`).then((r) =>
   r.length ? RedisClient.del(r) : 0,
  );

  data.stickers.forEach((sticker) => redis.stickers.set({ ...sticker, guild_id: data.guild_id }));
 },
} as const;
