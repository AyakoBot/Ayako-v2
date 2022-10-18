import type DDeno from 'discordeno';
import type Jobs from 'node-schedule';
import type NekoClient from '../BaseClient/NekoClient';
import type Constants from '../BaseClient/Other/Constants.json';
import type ObjectEmotes from '../BaseClient/Other/ObjectEmotes.json';
import type StringEmotes from '../BaseClient/Other/StringEmotes.json';
import type ReactionEmotes from '../BaseClient/Other/ReactionEmotes.json';
import type * as ch from '../BaseClient/ClientHelper';

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

  mainID: BigInt;

  channelQueue: Map<bigint, DDeno.CreateMessage[]>;
  channelTimeout: Map<bigint, Jobs.Job>;
  channelCharLimit: Map<bigint, number>;

  ch: typeof ch;
}

export interface Command {
  name: string;
  cooldownRows?: DBT.cooldowns;
  deleteCommandRows?: DBT.deletecommands;
  aliases: string[];
  takesFirstArg: false;
  dm: boolean;
  thisGuildOnly?: string[];
  perm?: bigint | number;
  dmOnly?: boolean;
  type: 'mod' | 'other' | 'owner';
  deleteCommandRow?: DBT.deletecommands;
  cooldown?: number;
  execute: <T extends keyof typeof import('../Languages/en.json')['commands']>(
    msg: DDeno.Message,
    {
      language,
      lan,
    }: {
      language: typeof import('../Languages/en.json');
      lan: typeof import('../Languages/en.json').commands[T];
    },
    command: Command,
    object?: { [key: string]: unknown },
  ) => void | Promise<void>;
}
