import type DDeno from 'discordeno';
import type Jobs from 'node-schedule';
import RedisXpSQL from 'pg-x-redis';
import type NekoClient from '../BaseClient/NekoClient.js';
import type Constants from '../BaseClient/Other/Constants.js';
import type ObjectEmotes from '../BaseClient/Other/ObjectEmotes.json';
import type StringEmotes from '../BaseClient/Other/StringEmotes.json';
import type ReactionEmotes from '../BaseClient/Other/ReactionEmotes.json';
import type * as ch from '../BaseClient/ClientHelper.js';
import * as CacheProxy from '../BaseClient/Other/permissions-plugin/index.js';

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
  automodRules: Map<bigint, DDeno.AutoModerationRule>;

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
  me: DDeno.User;
}

export type Language = typeof import('../Languages/en.js').default;

export type GuildUpdate = (
  client: DDeno.Bot,
  guild: DDeno.Guild,
  oldGuild: DDeno.Guild,
  fromCache?: true,
) => void;
export type UserUpdate = (
  client: DDeno.Bot,
  user: DDeno.User,
  oldUser: DDeno.User,
  fromCache?: true,
) => void;
export type ChannelUpdate = (
  client: DDeno.Bot,
  user: DDeno.Channel,
  oldUser: DDeno.Channel,
  fromCache?: true,
) => void;
export type MemberUpdate = (
  client: DDeno.Bot,
  member: DDeno.Member,
  user: DDeno.User,
  oldMember: DDeno.Member,
  fromCache?: true,
) => void;
export type RoleUpdate = (
  client: DDeno.Bot,
  role: DDeno.Role,
  oldRole: DDeno.Role,
  fromCache?: true,
) => void;
export type MessageUpdate = (
  client: DDeno.Bot,
  message: DDeno.Message,
  oldMessage: DDeno.Message,
  fromCache?: true,
) => void;

export type Client = CacheProxy.BotWithProxyCache<CacheProxy.ProxyCacheTypes<true>, CustomClient>;

export interface Command {
  cooldown: number;
  name: string;
  language: Language;
  takesFirstArg: boolean;
  aliases?: string[];
  thisGuildOnly: bigint[];
  perm?: 0 | bigint;
  dmOnly: boolean;
  dmAllowed: boolean;
  type: 'mod' | 'other' | 'owner';
  execute: <T extends keyof Language['commands']>(
    msg: Eris.Message,
    {
      language,
      lan,
    }: {
      language: Language;
      lan: Language.commands[T];
    },
    command: Command,
    object?: { [key: string]: unknown },
  ) => void | Promise<void>;
}

export interface InteractionResponse extends DDeno.InteractionResponse {
  ephemeral?: boolean;
}

export interface CreateMessage extends Omit<DDeno.CreateMessage, 'file'> {
  files?: DDeno.FileContent[];
}

export interface ModBaseEventOptions {
  executor: DDeno.User | undefined;
  target: DDeno.User;
  reason: string;
  msg?: DDeno.Message;
  cmd?: DDeno.Interaction;
  guild: DDeno.Guild | undefined;
  type:
    | 'banAdd'
    | 'softbanAdd'
    | 'tempbanAdd'
    | 'tempchannelbanAdd'
    | 'channelbanAdd'
    | 'channelbanRemove'
    | 'banRemove'
    | 'kickAdd'
    | 'roleAdd'
    | 'roleRemove'
    | 'muteRemove'
    | 'tempmuteAdd'
    | 'warnAdd';
  duration?: number;
  m?: DDeno.Message | null;
  doDBonly?: boolean;
  source?: string;
  forceFinish?: boolean;
  channel?: DDeno.Channel;
  role?: Eris.Role;
}

export interface MessageDM extends Omit<Omit<DDeno.Message, 'member'>, 'guildId'> {
  author: DDeno.User;
  channel: DDeno.Channel;
  language: Language;
}

export interface MessageGuild extends DDeno.Message {
  guild: DDeno.Guild;
  guildId: bigint;
  member: DDeno.Member;
  author: DDeno.User;
  channel: DDeno.Channel;
  language: Language;
}

export type Message = MessageGuild | MessageDM;

export interface ButtonInteraction extends Omit<DDeno.Interaction, 'data'> {
  data: DDeno.DiscordInteractionData;
}

export interface ReactionAdd {
  userId: bigint;
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  member?: DDeno.Member;
  user?: DDeno.User;
  emoji: DDeno.Emoji;
}

export interface ReactionRemove {
  userId: bigint;
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  emoji: DDeno.Emoji;
}
