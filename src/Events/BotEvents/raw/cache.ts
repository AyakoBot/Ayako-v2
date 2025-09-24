/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 // GatewayDispatchEvents,
 // type APIGuildChannel,
 // type APIThreadChannel,
 // type GatewayApplicationCommandPermissionsUpdateDispatchData,
 type GatewayDispatchPayload,
 // type GatewayGuildSoundboardSoundsUpdateDispatchData,
 // type GatewayInteractionCreateDispatchData,
 // type GatewayPresenceUpdateDispatchData,
 // type GatewayReadyDispatchData,
 // type GatewayResumedDispatch,
 // type GatewayTypingStartDispatchData,
 // type GatewayUserUpdateDispatchData,
 // type GatewayWebhooksUpdateDispatchData,
} from 'discord.js';
// import type { RChannelTypes } from '../../../BaseClient/Bot/Cache/channel.js';
// import { cache as redis } from '../../../BaseClient/Bot/Redis.js';
// import {
//  AllNonThreadGuildChannelTypes,
//  AllThreadGuildChannelTypes,
// } from '../../../Typings/Channel.js';

// import AutoModeration from './Cache/AutoModeration.js';
// import Channel from './Cache/Channel.js';
// import Entitlements from './Cache/Entitlements.js';
// import Guilds from './Cache/Guilds.js';
// import Integration from './Cache/Integration.js';
// import Invite from './Cache/Invite.js';
// import Message from './Cache/Message.js';
// import Stage from './Cache/Stage.js';
// import Subscription from './Cache/Subscription.js';
// import Thread from './Cache/Thread.js';
// import Voice from './Cache/Voice.js';

export default async (_: GatewayDispatchPayload) => {
 // const cache = caches[data.t];
 // if (!cache) return;

 // cache(data.d as Parameters<typeof cache>[0]);
};

// const caches: Record<GatewayDispatchEvents, (data: never) => unknown> = {
//  ...AutoModeration,
//  ...Channel,
//  ...Entitlements,
//  ...Guilds,
//  ...Integration,
//  ...Invite,
//  ...Message,
//  ...Stage,
//  ...Thread,
//  ...Voice,
//  ...Subscription,

//  [GatewayDispatchEvents.ApplicationCommandPermissionsUpdate]: (
//   data: GatewayApplicationCommandPermissionsUpdateDispatchData,
//  ) => data.permissions.forEach((p) => redis.commandPermissions.set(p, data.guild_id)),

//  [GatewayDispatchEvents.SoundboardSounds]: (data: GatewayGuildSoundboardSoundsUpdateDispatchData) =>
//   data.soundboard_sounds.forEach((sound) =>
//    redis.soundboards.set({ ...sound, guild_id: data.guild_id || sound.guild_id }),
//   ),

//  [GatewayDispatchEvents.InteractionCreate]: (data: GatewayInteractionCreateDispatchData) => {
//   if (data.user) redis.users.set(data.user);

//   if (data.message && data.guild_id) {
//    redis.messages.set(data.message, (data.guild_id || data.guild?.id)!);
//   }

//   if (!data.channel || !data.guild_id) return;

//   if (AllThreadGuildChannelTypes.includes(data.channel.type)) {
//    redis.threads.set({
//     ...(data.channel as APIThreadChannel),
//     guild_id: (data.channel as APIThreadChannel).guild_id || data.guild_id,
//    });
//    return;
//   }

//   if (!AllNonThreadGuildChannelTypes.includes(data.channel.type)) return;

//   redis.channels.set({
//    ...(data.channel as APIGuildChannel<RChannelTypes>),
//    guild_id: data.guild_id || (data.channel as APIGuildChannel<RChannelTypes>).guild_id,
//   });
//  },

//  [GatewayDispatchEvents.UserUpdate]: (data: GatewayUserUpdateDispatchData) => redis.users.set(data),

//  [GatewayDispatchEvents.WebhooksUpdate]: (_: GatewayWebhooksUpdateDispatchData) => undefined,

//  [GatewayDispatchEvents.TypingStart]: (data: GatewayTypingStartDispatchData) => {
//   if (!data.member || !data.guild_id) return;

//   redis.members.set(data.member, data.guild_id);
//  },

//  [GatewayDispatchEvents.Ready]: (data: GatewayReadyDispatchData) => redis.users.set(data.user),

//  [GatewayDispatchEvents.Resumed]: (_: GatewayResumedDispatch['d']) => undefined,

//  [GatewayDispatchEvents.PresenceUpdate]: (_: GatewayPresenceUpdateDispatchData) => undefined,
// };
