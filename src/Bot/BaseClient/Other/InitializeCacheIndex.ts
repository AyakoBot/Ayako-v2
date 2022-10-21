import Redis from 'redis';
import DataBase from '../DataBase.js';

export const expectedTypes = {
  guilds: {
    name: Redis.SchemaFieldTypes.TEXT,
    premiumSubscriptionCount: Redis.SchemaFieldTypes.TEXT,
    vanityUrlCode: Redis.SchemaFieldTypes.TEXT,
    joinedAt: Redis.SchemaFieldTypes.TEXT,
    id: Redis.SchemaFieldTypes.TEXT,
    memberCount: Redis.SchemaFieldTypes.TEXT,
    shardId: Redis.SchemaFieldTypes.TEXT,
  },
  channels: {
    name: Redis.SchemaFieldTypes.TEXT,
    topic: Redis.SchemaFieldTypes.TEXT,
    nsfw: Redis.SchemaFieldTypes.TAG,
    parentId: Redis.SchemaFieldTypes.TEXT,
    id: Redis.SchemaFieldTypes.TEXT,
    guildId: Redis.SchemaFieldTypes.TEXT,
    type: Redis.SchemaFieldTypes.TEXT,
  },
  users: {
    avatar: Redis.SchemaFieldTypes.TEXT,
    discriminator: Redis.SchemaFieldTypes.TEXT,
    id: Redis.SchemaFieldTypes.TEXT,
    username: Redis.SchemaFieldTypes.TEXT,
  },
  members: {
    avatar: Redis.SchemaFieldTypes.TEXT,
    permissions: Redis.SchemaFieldTypes.TEXT,
    nick: Redis.SchemaFieldTypes.TEXT,
    premiumSince: Redis.SchemaFieldTypes.TEXT,
    communicationDisabledUntil: Redis.SchemaFieldTypes.TEXT,
    id: Redis.SchemaFieldTypes.TEXT,
    guildId: Redis.SchemaFieldTypes.TEXT,
    roles: Redis.SchemaFieldTypes.TAG,
    joinedAt: Redis.SchemaFieldTypes.TEXT,
  },
  roles: {
    id: Redis.SchemaFieldTypes.TEXT,
    guildId: Redis.SchemaFieldTypes.TEXT,
    name: Redis.SchemaFieldTypes.TEXT,
    permissions: Redis.SchemaFieldTypes.TEXT,
    color: Redis.SchemaFieldTypes.TEXT,
  },
  messages: {
    guildId: Redis.SchemaFieldTypes.TEXT,
    components: Redis.SchemaFieldTypes.TAG,
    editedTimestamp: Redis.SchemaFieldTypes.TEXT,
    reactions: Redis.SchemaFieldTypes.TAG,
    stickerItems: Redis.SchemaFieldTypes.TAG,
    webhookId: Redis.SchemaFieldTypes.TEXT,
    messageReference: Redis.SchemaFieldTypes.TEXT,
    id: Redis.SchemaFieldTypes.TEXT,
    type: Redis.SchemaFieldTypes.TEXT,
    channelId: Redis.SchemaFieldTypes.TEXT,
    content: Redis.SchemaFieldTypes.TEXT,
    embeds: Redis.SchemaFieldTypes.TAG,
    attachments: Redis.SchemaFieldTypes.TAG,
    authorId: Redis.SchemaFieldTypes.TEXT,
  },
};

export default () => {
  Object.entries(expectedTypes).forEach((e) => {
    const dataObject: { [key: string]: { type: string; SORTABLE: false; AS: string } } = {};

    Object.entries(e[1]).forEach((d) => {
      dataObject[`$.${d[0]}`] = {
        type: d[1],
        SORTABLE: false,
        AS: d[0],
      };
    });

    DataBase.redis.ft.create(`index:bot-${e[0]}`, dataObject as never, {
      ON: 'JSON',
      PREFIX: `bot-${e[0]}`,
    });
  });
};
