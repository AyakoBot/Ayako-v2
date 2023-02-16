import type * as Discord from 'discord.js';

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
    object?: { [key: string]: unknown },
  ) => void | Promise<void>;
}

export interface ModBaseEventOptions {
  executor: Discord.User | undefined;
  target: Discord.User;
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
