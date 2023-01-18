import type * as Discord from 'discord.js';

export type Language = typeof import('../Languages/en.js').default;

export type Client = CustomClient;

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

export interface ModBaseEventOptions {
  executor: Discord.User | undefined;
  target: Discord.User;
  reason: string;
  msg?: Discord.GuildMessage;
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
  m?: Discord.GuildMessage | null;
  doDBonly?: boolean;
  source?: string;
  forceFinish?: boolean;
  channel?: Discord.GuildChannel;
  role?: Eris.Role;
}

export interface Message extends Discord.Message {
  language: Language;
}

export type AcceptedMergingTypes = 'string' | 'boolean' | 'difference' | 'icon';
