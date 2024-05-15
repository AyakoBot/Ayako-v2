import Prisma from '@prisma/client';
import * as Discord from 'discord.js';

export type * from '../BaseClient/Cluster/PG.js';
export type * from './DataBase.js';
export * from './Settings.js';
export type * from './TopGG.js';
export * from '../SlashCommands/index.js';

export type Language = import('../BaseClient/Other/language.js').default;

export interface Command<T extends boolean | undefined> {
 takesFirstArg: boolean;
 thisGuildOnly: string[];
 dmOnly: boolean;
 dmAllowed: T;
 type: 'mod' | 'other' | 'owner';
 requiresSlashCommand: boolean;
 default: (
  msg: Discord.Message<T extends true ? false : true>,
  args: string[],
  {
   language,
   command,
   prefix,
  }: {
   language: Language;
   command: Command<T>;
   prefix: string;
  },
 ) => void | Promise<void>;
}

export type AcceptedMergingTypes = 'string' | 'boolean' | 'difference' | 'icon' | 'image';

export interface AutoCompleteFile {
 default: (
  cmd: Discord.AutocompleteInteraction<'cached'> | { guild: Discord.Guild },
 ) => Promise<{ name: string; value: string }[] | undefined>;
}

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
 answertypes: Prisma.appealquestions['answertype'][];
};

export type DePromisify<T> = T extends Promise<infer U> ? U : T;

export type NeverNull<T, K extends keyof T> = {
 [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};

export type UsualMessagePayload = {
 embeds?: Discord.APIEmbed[];
 content?: string;
 components?: Discord.APIActionRowComponent<
  Discord.APIButtonComponent | Discord.APISelectMenuComponent
 >[];
 files?: (Discord.AttachmentPayload | Discord.Attachment)[];
 ephemeral?: boolean;
 allowed_mentions?: Discord.APIAllowedMentions;
};

export type HelpCommand =
 | {
    parentCommand: string;
    subCommandGroup: string;
    subCommand: string;
   }
 | {
    parentCommand: string;
    subCommand: string;
    subCommandGroup?: undefined;
   }
 | {
    parentCommand: string;
    subCommandGroup?: undefined;
    subCommand?: undefined;
   };

export enum Colors {
 Danger = 0xff0000,
 Success = 0x00ff00,
 Ephemeral = 0x2b2d31,
 Loading = 0xffff00,
 Base = 0xb0ff00,
}

export enum ModTypes {
 RoleAdd = 'roleAdd',
 RoleRemove = 'roleRemove',
 TempMuteAdd = 'tempMuteAdd',
 MuteRemove = 'muteRemove',
 BanAdd = 'banAdd',
 BanRemove = 'banRemove',
 SoftBanAdd = 'softBanAdd',
 TempBanAdd = 'tempBanAdd',
 ChannelBanAdd = 'channelBanAdd',
 TempChannelBanAdd = 'tempChannelBanAdd',
 ChannelBanRemove = 'channelBanRemove',
 KickAdd = 'kickAdd',
 WarnAdd = 'warnAdd',
 SoftWarnAdd = 'softWarnAdd',
 StrikeAdd = 'strikeAdd',
 UnAfk = 'unAfk',
}

export const ModColors: Record<ModTypes, Colors> = {
 [ModTypes.RoleAdd]: Colors.Success,
 [ModTypes.RoleRemove]: Colors.Danger,
 [ModTypes.TempMuteAdd]: Colors.Success,
 [ModTypes.MuteRemove]: Colors.Danger,
 [ModTypes.BanAdd]: Colors.Danger,
 [ModTypes.BanRemove]: Colors.Success,
 [ModTypes.SoftBanAdd]: Colors.Danger,
 [ModTypes.TempBanAdd]: Colors.Danger,
 [ModTypes.ChannelBanAdd]: Colors.Danger,
 [ModTypes.TempChannelBanAdd]: Colors.Danger,
 [ModTypes.ChannelBanRemove]: Colors.Success,
 [ModTypes.KickAdd]: Colors.Danger,
 [ModTypes.WarnAdd]: Colors.Danger,
 [ModTypes.SoftWarnAdd]: Colors.Danger,
 [ModTypes.StrikeAdd]: Colors.Danger,
 [ModTypes.UnAfk]: Colors.Success,
};

export type BaseOptions = {
 reason: string;
 dbOnly: boolean;
 guild: Discord.Guild;
 target: Discord.User;
 executor: Discord.User;
 skipChecks: boolean;
};

type Channel = {
 channel:
  | Discord.NewsChannel
  | Discord.StageChannel
  | Discord.TextChannel
  | Discord.VoiceChannel
  | Discord.ForumChannel
  | Discord.MediaChannel;
};

type Roles = { roles: Discord.Role[] };
type Temp = { duration: number };
type Empty = NonNullable<unknown>;
type DeleteMessageSeconds = { deleteMessageSeconds: number };

type SpecificOpts = {
 [ModTypes.RoleAdd]: Roles;
 [ModTypes.RoleRemove]: Roles;
 [ModTypes.TempMuteAdd]: Temp;
 [ModTypes.MuteRemove]: Empty;
 [ModTypes.BanAdd]: DeleteMessageSeconds;
 [ModTypes.SoftBanAdd]: DeleteMessageSeconds;
 [ModTypes.TempBanAdd]: Temp & DeleteMessageSeconds;
 [ModTypes.ChannelBanAdd]: Channel;
 [ModTypes.TempChannelBanAdd]: Channel & Temp;
 [ModTypes.ChannelBanRemove]: Channel;
 [ModTypes.BanRemove]: Empty;
 [ModTypes.KickAdd]: Empty;
 [ModTypes.WarnAdd]: Empty;
 [ModTypes.SoftWarnAdd]: Empty;
 [ModTypes.StrikeAdd]: Empty;
 [ModTypes.UnAfk]: Empty;
};

type SpecificOptions = { [K in ModTypes]: SpecificOpts[K] };

export type ModOptions<T extends ModTypes> = BaseOptions & SpecificOptions[T];
