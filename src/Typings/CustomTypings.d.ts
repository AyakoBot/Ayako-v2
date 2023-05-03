import type * as Discord from 'discord.js';
import * as ch from '../BaseClient/ClientHelper.js';
import * as DBT from './DataBaseTypings';

export type Language = typeof import('../Languages/en.js').default;

export interface Command {
  cooldown: number;
  name: string;
  takesFirstArg: boolean;
  aliases: string[];
  thisGuildOnly: string[];
  perm: 0 | bigint;
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
    | 'tempbanAdd'
    | 'banRemove'
    | 'softbanAdd'
    | 'roleAdd'
    | 'roleRemove'
    | 'kickAdd'
    | 'tempmuteAdd'
    | 'muteRemove'
    | 'channelbanAdd'
    | 'tempchannelbanAdd'
    | 'channelbanRemove'
    | 'warnAdd';
  duration?: number;
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
  'reaction-role-settings': DBT.reactionrolesettings;
  'button-role-settings': DBT.buttonrolesettings;
  'reaction-roles': DBT.reactionroles;
  'button-roles': DBT.buttonroles;
};

export interface AutoCompleteFile {
  default: (
    cmd: Discord.AutocompleteInteraction,
  ) => Promise<{ name: string; value: string }[] | undefined>;
}

type FieldName<T extends keyof TableNamesMap> = keyof TableNamesMap[T]['fields'];

export interface SettingsFile<K extends keyof TableNamesMap> {
  getEmbeds: (
    embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
    settings: TableNamesMap[K],
    language: Language,
    lan: Language['slashCommands']['settings']['categories'][K],
  ) => Discord.APIEmbed[] | Promise<Discord.APIEmbed[]>;
  getComponents: (
    buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
    settings: TableNamesMap[K],
    language: Language,
  ) =>
    | Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]
    | Promise<Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]>;
  showAll?: (
    cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
    language: Language,
    lan: Language['slashCommands']['settings']['categories'][K],
  ) => Promise<void>;
  showID?: (
    cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
    ID: string,
    language: Language,
    lan: Language['slashCommands']['settings']['categories'][K],
  ) => Promise<void>;
  postChange?: (
    oldSetting: TableNamesMap[K],
    newSetting: TableNamesMap[K],
    changedSetting: FieldName<K>,
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

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type RawUser = {
  id: string;
  username: string;
  global_name: null;
  display_name: null;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string;
  banner_color: null;
  accent_color: null;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  avatar_decoration: string;
  email: string;
  verified: boolean;
};

export type Appeal = {
  userid: string;
  guildid: string;
  punishmentid: string;
  questions: string[];
  answers: string[];
  answertypes: DBT.appealquestions['answertype'][];
}

export type punishment =
  | DBT.punish_bans
  | DBT.punish_channelbans
  | DBT.punish_kicks
  | DBT.punish_mutes
  | DBT.punish_tempbans
  | DBT.punish_tempchannelbans
  | DBT.punish_tempmutes
  | DBT.punish_warns;