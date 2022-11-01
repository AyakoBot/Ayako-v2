import type DDeno from 'discordeno';
import type Jobs from 'node-schedule';
import RedisXpSQL from 'pg-x-redis';
import type NekoClient from '../BaseClient/NekoClient.js';
import type Constants from '../BaseClient/Other/Constants.json';
import type ObjectEmotes from '../BaseClient/Other/ObjectEmotes.json';
import type StringEmotes from '../BaseClient/Other/StringEmotes.json';
import type ReactionEmotes from '../BaseClient/Other/ReactionEmotes.json';
import type * as ch from '../BaseClient/ClientHelper.js';
import * as CacheProxy from '../BaseClient/Other/cache-proxy/index.js';

export interface CustomClient extends DDeno.Bot {
  mutes: Map<string, Jobs.Job>;
  bans: Map<string, Jobs.Job>;
  channelBans: Map<string, Jobs.Job>;
  reminders: Map<string, Jobs.Job>;
  disboardBumpReminders: Map<string, Jobs.Job>;
  giveaways: Map<string, Jobs.Job>;
  invites: Map<string, DDeno.Invite[]>;
  verificationCodes: Map<string, string>;
  webhooks: Map<string, DDeno.Webhook[]>;
  giveawayClaimTimeout: Map<string, Jobs.Job>;

  neko: typeof NekoClient;
  customConstants: typeof Constants;
  objectEmotes: typeof ObjectEmotes;
  stringEmotes: typeof StringEmotes;
  reactionEmotes: typeof ReactionEmotes;

  mainID: bigint;

  channelQueue: Map<bigint, CreateMessage[]>;
  channelTimeout: Map<bigint, Jobs.Job>;
  channelCharLimit: Map<bigint, number>;

  ch: typeof ch;
  database: RedisXpSQL;
}

export type Language = typeof import('../Languages/en.json');

export type GuildUpdate = (client: DDeno.Bot, guild: DDeno.Guild, oldGuild: DDeno.Guild) => void;
export type UserUpdate = (client: DDeno.Bot, user: DDeno.User, oldUser: DDeno.User) => void;
export type ChannelUpdate = (
  client: DDeno.Bot,
  user: DDeno.Channel,
  oldUser: DDeno.Channel,
) => void;
export type MemberUpdate = (
  client: DDeno.Bot,
  member: DDeno.Member,
  user: DDeno.User,
  oldMember: DDeno.Member,
) => void;
export type RoleUpdate = (client: DDeno.Bot, role: DDeno.Role, oldRole: DDeno.Role) => void;
export type MessageUpdate = (
  client: DDeno.Bot,
  message: DDeno.Message,
  oldMessage: DDeno.Message,
) => void;

export type Client = CacheProxy.BotWithProxyCache<CacheProxy.ProxyCacheTypes<true>, CustomClient>;

export interface Command {
  cooldown: number;
  name: string;
  language: Language;
}

export interface InteractionResponse extends DDeno.InteractionResponse {
  ephemeral?: boolean;
}

export interface CreateMessage extends Omit<DDeno.CreateMessage, 'file'> {
  files?: DDeno.FileContent[];
}
