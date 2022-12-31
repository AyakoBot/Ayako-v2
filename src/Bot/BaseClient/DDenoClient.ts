import * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-unresolved
import enableHelpersPlugin from 'discordeno/helpers-plugin';
import * as CacheProxy from './Other/permissions-plugin/index.js';
import type CT from '../Typings/CustomTypings';
import NekoClient from './NekoClient.js';
import * as config from '../../configs.js';
import Constants from './Other/Constants.js';
import ObjectEmotes from './Other/ObjectEmotes.json' assert { type: 'json' };
import StringEmotes from './Other/StringEmotes.json' assert { type: 'json' };
import ReactionEmotes from './Other/ReactionEmotes.json' assert { type: 'json' };
import eventHandler from '../Events/baseEventHandler.js';
import DataBase from './DataBase.js';

const events: { [key: string]: typeof eventHandler } = {};
Constants.allEvents.forEach((e) => {
  events[e] = eventHandler;
});

const customizeBot = <B extends DDeno.Bot = DDeno.Bot>(client: B) => {
  const customized = client as unknown as CT.CustomClient;

  customized.mutes = new Map();
  customized.bans = new Map();
  customized.channelBans = new Map();
  customized.reminders = new Map();
  customized.disboardBumpReminders = new Map();
  customized.giveaways = new Map();
  customized.invites = new Map();
  customized.verificationCodes = new Map();
  customized.webhooks = new Map();
  customized.giveawayClaimTimeout = new Map();
  customized.automodRules = new Map();
  customized.emojis = new Map();

  customized.neko = NekoClient;
  customized.customConstants = Constants;

  customized.objectEmotes = ObjectEmotes;
  customized.stringEmotes = StringEmotes;
  customized.reactionEmotes = ReactionEmotes;

  customized.mainID = BigInt(config.BOT_ID);

  customized.channelQueue = new Map();
  customized.channelTimeout = new Map();
  customized.channelCharLimit = new Map();

  customized.database = DataBase;

  return customized;
};

const client = CacheProxy.createProxyCache(
  customizeBot(
    enableHelpersPlugin(
      DDeno.createBot({
        events,
        intents: 112383 as DDeno.GatewayIntents,
        token: config.DISCORD_TOKEN,
      }),
    ),
  ),
  {
    fetchIfMissing: {
      guilds: true,
      roles: true,
      messages: true,
      channels: true,
      users: true,
      members: true,
    },
    shouldCache: {
      guild: async (data: DDeno.Guild) => {
        const oldData = (await client.cache.guilds.get(data.id, false)) as DDeno.Guild;

        if (oldData) (client.events.guildUpdate as CT.GuildUpdate)(client, data, oldData, true);
        // eslint-disable-next-line import/no-cycle
        else (await import('../Events/guildEvents/guildCacheAdd/guildCacheAdd.js')).default(data);

        return true;
      },
      user: async (data: DDeno.User) => {
        const oldData = (await client.cache.users.get(data.id, false)) as DDeno.User;

        if (oldData) (client.events.botUpdate as CT.UserUpdate)(client, data, oldData, true);
        return true;
      },
      channel: async (data: DDeno.Channel) => {
        const oldData = (await client.cache.channels.get(
          data.id,
          data.guildId,
          false,
        )) as DDeno.Channel;

        if (oldData) (client.events.channelUpdate as CT.ChannelUpdate)(client, data, oldData, true);
        return true;
      },
      member: async (data: DDeno.Member) => {
        const oldData = (await client.cache.members.get(
          data.id,
          data.guildId,
          false,
        )) as DDeno.Member;

        const user = (await client.cache.users.get(data.id, false)) as DDeno.User;
        if (oldData) {
          (client.events.guildMemberUpdate as CT.MemberUpdate)(client, data, user, oldData, true);
        }
        return true;
      },
      role: async (data: DDeno.Role) => {
        const oldData = (await client.cache.roles.get(data.id, data.guildId, false)) as DDeno.Role;
        if (oldData) (client.events.roleUpdate as CT.RoleUpdate)(client, data, oldData, true);
        return true;
      },
      message: async (data: DDeno.Message) => {
        const oldData = (await client.cache.messages.get(
          data.id,
          data.channelId,
          data.guildId,
          false,
        )) as DDeno.Message;
        if (oldData) (client.events.messageUpdate as CT.MessageUpdate)(client, data, oldData, true);
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
        'permissions',
      ],
      channels: [
        'name',
        'topic',
        'nsfw',
        'parentId',
        'id',
        'guildId',
        'type',
        'permissionOverwrites',
        'permissions',
      ],
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
        'permissions',
      ],
      roles: ['id', 'guildId', 'name', 'permissions', 'color', 'toggles', 'permissions'],
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
      default: true,
    },
    cacheOutsideMemory: {
      guilds: false,
      users: false,
      channels: false,
      members: false,
      roles: false,
      messages: false,
      default: false,
    },
  },
);

client.rest = DDeno.createRestManager({
  token: config.DISCORD_TOKEN,
  secretKey: config.REST_AUTHORIZATION,
  customUrl: config.REST_URL,
});

client.me = (await client.cache.users.get(client.id)) as DDeno.User;

export default client;
