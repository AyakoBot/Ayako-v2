import type * as Discord from 'discord.js';
import * as ch from '../BaseClient/ClientHelper.js';
import * as DBT from './DataBaseTypings';

export type Language = typeof import('../Languages/en.js').default;

export interface Command {
  cooldown: number;
  name: string;
  takesFirstArg: boolean;
  aliases?: string[];
  thisGuildOnly: string[];
  perm?: 0 | bigint;
  dmOnly: boolean;
  dmAllowed: boolean;
  type: 'mod' | 'other' | 'owner';
  default: <T extends keyof Language['commands']>(
    msg: Discord.Message,
    command: Command,
    args?: string[],
    object?: Record<string, unknown>,
  ) => void | Promise<void>;
}

export interface ModBaseEventOptions {
  executor: Discord.User | bEvalUser | undefined;
  target: Discord.User | bEvalUser;
  reason: string;
  msg?: Discord.Message;
  cmd?: Discord.GuildInteraction;
  guild: Discord.Guild | undefined;
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
  m?: Discord.Message;
  doDBonly?: boolean;
  source?: string;
  forceFinish?: boolean;
  channel?: Discord.GuildChannel;
  role?: Discord.Role;
}

export type AcceptedMergingTypes = 'string' | 'boolean' | 'difference' | 'icon';

export interface TopGGBotVote {
  bot: string;
  user: string;
  type: 'upvote' | 'test';
  isWeekend: boolean;
  query?: string;
  authorization: string;
}

export interface TopGGGuildVote {
  guild: string;
  user: string;
  type: 'upvote' | 'test';
  query?: string;
  authorization: string;
}

export interface bEvalUser {
  id: string;
  bot: boolean;
  system: boolean;
  flags: number;
  username: string;
  discriminator: string;
  avatar?: string;
  banner?: string;
  accentColor?: string;
  createdTimestamp: number;
  defaultAvatarURL: string;
  hexAccentColor?: string;
  tag: string;
  avatarURL?: string;
  displayAvatarURL: string;
  bannerURL?: string;
}

type TableNamesMap = {
  'anti-spam': DBT.antispam;
  'anti-spam-punishments': DBT.punishments;
  'anti-virus-punishments': DBT.punishments;
  'blacklist-punishments': DBT.punishments;
  'anti-raid': DBT.antiraid;
  'anti-virus': DBT.antivirus;
  'auto-punish': DBT.autopunish;
  blacklist: DBT.blacklist;
  'auto-roles': DBT.autoroles;
  cooldowns: DBT.cooldowns;
  expiry: DBT.expiry;
  'disboard-reminders': DBT.disboard;
  'self-roles': DBT.selfroles;
  separators: DBT.roleseparator;
  sticky: DBT.sticky;
  verification: DBT.verification;
  welcome: DBT.welcome;
  leveling: DBT.leveling;
  nitro: DBT.nitrosettings;
  'delete-commands': DBT.deletecommands;
  suggestions: DBT.suggestionsettings;
  logs: DBT.logchannels;
  basic: DBT.guildsettings;
  'multi-channels': DBT.levelingmultichannels;
  'multi-roles': DBT.levelingmultiroles;
  'level-roles': DBT.levelingroles;
  'rule-channels': DBT.levelingruleschannels;
  'nitro-roles': DBT.nitroroles;
  vote: DBT.votesettings;
  'vote-rewards': DBT.voterewards;
};

type SettingsTable<T extends keyof TableNamesMap> = {
  [K in T]: { guildid: string } & TableNamesMap[K];
};

export interface SettingsFile<T extends keyof TableNamesMap> {
  getEmbeds: <K extends keyof TableNamesMap>(
    embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
    settings: TableNamesMap[T] | null,
    language: Language,
    lan: Language['slashCommands']['settings']['categories'][T],
  ) => Discord.APIEmbed[] | Promise<Discord.APIEmbed[]>;
  getComponents: (
    buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
    settings: TableNamesMap[T] | null,
    language: Language,
  ) =>
    | Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]
    | Promise<Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]>;
  showAll?: (
    cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
    language: Language,
    lan: Language['slashCommands']['settings']['categories'][T],
  ) => Promise<void>;
  postChange?: (
    oldSetting: TableNamesMap[T] | null,
    newSetting: TableNamesMap[T] | null,
    changedSetting: keyof FieldName<T>,
    settingName: keyof CT.TableNamesMap,
    uniquetimestamp?: number,
  ) => Promise<void>;
}

type AllKeys<T> = T extends T ? keyof T : never;
type FilterSettings<T, K extends AllKeys<T>> = Extract<T, Record<K, any>>;

type SuccessfulTopGGResponse = {
  username: string;
  id: string;
  discriminator: string;
  avatar: string;
  defAvatar: string;
  prefix: string;
  shortdesc: string;
  longdesc: string;
  tags?: string[];
  website: string;
  support: string;
  github: string;
  owners: string[];
  guilds: string[];
  invite: string;
  date: string;
  server_count: number;
  shard_count: string;
  certifiedBot: string;
  vanity: string;
  points: number;
  monthlyPoints: number;
  donatebotguildid: string;
};

type FailedTopGGResponse = { error: string };

export type TopGGResponse<T extends boolean> = T extends true
  ? SuccessfulTopGGResponse
  : FailedTopGGResponse;
