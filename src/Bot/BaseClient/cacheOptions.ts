import type * as DDeno from 'discordeno';
import type { CreateProxyCacheOptions } from './Other/cache-proxy/index.js';
// eslint-disable-next-line import/no-cycle
import client from './DDenoClient.js';
import type CT from '../Typings/CustomTypings';

const cacheOptions: CreateProxyCacheOptions = {
  fetchIfMissing: {
    guilds: true,
    roles: true,
  },
  shouldCache: {
    guild: async (data: DDeno.Guild) => {
      return false;
      const oldData = (await cacheOptions.getItem?.('guild', data.id)) as DDeno.Guild;

      if (oldData) (client.events.guildUpdate as CT.GuildUpdate)(client, data, oldData);
      return true;
    },
    user: async (data: DDeno.User) => {
      const oldData = (await cacheOptions.getItem?.('user', data.id)) as DDeno.User;

      if (oldData) (client.events.botUpdate as CT.UserUpdate)(client, data, oldData);
      return true;
    },
    channel: async (data: DDeno.Channel) => {
      const oldData = (await cacheOptions.getItem?.('channel', data.id)) as DDeno.Channel;

      if (oldData) (client.events.channelUpdate as CT.ChannelUpdate)(client, data, oldData);
      return true;
    },
    member: async (data: DDeno.Member) => {
      const oldData = (await cacheOptions.getItem?.(
        'member',
        data.id,
        data.guildId,
      )) as DDeno.Member;

      const user = (await cacheOptions.getItem?.('user', data.id)) as DDeno.User;
      if (oldData) {
        (client.events.guildMemberUpdate as CT.MemberUpdate)(client, data, user, oldData);
      }
      return true;
    },
    role: async (data: DDeno.Role) => {
      const oldData = (await cacheOptions.getItem?.('role', data.id)) as DDeno.Role;
      if (oldData) (client.events.roleUpdate as CT.RoleUpdate)(client, data, oldData);
      return true;
    },
    message: async (data: DDeno.Message) => {
      const oldData = (await cacheOptions.getItem?.('message', data.id)) as DDeno.Message;
      if (oldData) (client.events.messageUpdate as CT.MessageUpdate)(client, data, oldData);
      return true;
    },
  },
  desiredProps: {
    guilds: [
      'name',
      'premiumSubscriptionCount',
      'vanityUrlCode',
      'joinedAt',
      'id',
      'memberCount',
      'shardId',
      'toggles',
    ],
    channels: ['name', 'topic', 'nsfw', 'parentId', 'id', 'guildId', 'type'],
    users: ['avatar', 'discriminator', 'id', 'username', 'toggles'],
    members: [
      'avatar',
      'permissions',
      'nick',
      'premiumSince',
      'communicationDisabledUntil',
      'id',
      'guildId',
      'roles',
      'joinedAt',
      'toggles',
    ],
    roles: ['id', 'guildId', 'name', 'permissions', 'color', 'toggles'],
    messages: [
      'guildId',
      'components',
      'editedTimestamp',
      'reactions',
      'stickerItems',
      'webhookId',
      'messageReference',
      'id',
      'type',
      'channelId',
      'timestamp',
      'content',
      'embeds',
      'attachments',
      'authorId',
      'mentionedChannelIds',
      'mentionedRoleIds',
      'mentionedUserIds',
    ],
  },
  cacheInMemory: {
    guilds: true,
    users: true,
    channels: true,
    members: true,
    roles: true,
    messages: true,
  },
  cacheOutsideMemory: {
    guilds: false,
    users: false,
    channels: false,
    members: false,
    roles: false,
    messages: false,
  },
};

export default cacheOptions;
