import type { CreateProxyCacheOptions } from 'cache-proxy';
import type * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-cycle
import client from './DDenoClient.js';
import type CT from '../Typings/CustomTypings';
import DataBase from './DataBase.js';
import IndexInit, { expectedTypes } from './Other/InitializeCacheIndex.js';

IndexInit();

const desiredProps: { [key: string]: string[] } = {};
Object.keys(expectedTypes).forEach((d) => {
  desiredProps[d] = Object.keys(expectedTypes[d as keyof typeof expectedTypes]);
});

const cacheOptions: CreateProxyCacheOptions = {
  shouldCache: {
    guild: async (data: DDeno.Guild) => {
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
      const oldData = (await cacheOptions.getItem?.('member', data.id)) as DDeno.Member;
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
  desiredProps,
  cacheInMemory: {
    guilds: false,
    users: false,
    channels: false,
    members: false,
    roles: false,
    messages: false,
  },
  cacheOutsideMemory: {
    guilds: true,
    users: true,
    channels: true,
    members: true,
    roles: true,
    messages: true,
  },
  getItem: <T>(
    table: 'guild' | 'channel' | 'role' | 'member' | 'message' | 'user',
    id: bigint,
  ): Promise<T> => DataBase.redis.json.get(`bot-${table}:${String(id)}`) as Promise<T>,
  addItem: (
    table: 'guild' | 'channel' | 'role' | 'member' | 'message' | 'user',
    item: { id: string; guildId: string },
  ): Promise<unknown> => {
    if (table === 'member') {
      return DataBase.redis.json.set(
        `bot-${table}:${String(item.id)}:${String(item.guildId)}`,
        '$',
        item,
      );
    }
    return DataBase.redis.json.set(`bot-${table}:${String(item.id)}`, '$', item);
  },
  removeItem: (
    table: 'guild' | 'channel' | 'role' | 'member' | 'message' | 'user',
    id: bigint,
  ): Promise<unknown> => DataBase.redis.json.del(`bot-${table}:${String(id)}`),
  bulk: {
    removeGuild: async (id: bigint): Promise<void> => {
      const channels = await DataBase.redis.ft.search(`index:bot-channel`, `(@guildId:${id})`);
      const roles = await DataBase.redis.ft.search(`index:bot-role`, `(@guildId:${id})`);
      const members = await DataBase.redis.ft.search(`index:bot-member`, `(@guildId:${id})`);
      const messages = await DataBase.redis.ft.search(`index:bot-message`, `(@guildId:${id})`);

      [
        ...channels.documents,
        ...roles.documents,
        ...members.documents,
        ...messages.documents,
      ].forEach((d) => {
        DataBase.redis.json.del(d.id);
      });
    },
    removeChannel: async (id: bigint): Promise<void> => {
      const messages = await DataBase.redis.ft.search(`index:bot-message`, `(@channelId:${id})`);

      messages.documents.forEach((d) => {
        DataBase.redis.json.del(d.id);
      });
    },
    removeRole: async (id: bigint): Promise<void> => {
      const members = await DataBase.redis.ft.search(`index:bot-members`, `(@roles:{${id}})`);

      members.documents.forEach((m) => {
        const newMember = m.value;
        const roleIndex = (newMember.roles as unknown as bigint[])?.indexOf(id);
        (newMember.roles as unknown as bigint[]).splice(roleIndex, 1);

        cacheOptions.addItem?.('member', newMember);
      });
    },
    removeMessages: async (ids: bigint[]): Promise<void> => {
      const messages = await DataBase.redis.ft.search(
        `index:bot-message`,
        `(@id:(${ids.join('|')}))`,
      );

      messages.documents.forEach((d) => {
        DataBase.redis.json.del(d.id);
      });
    },
  },
};

export default cacheOptions;
