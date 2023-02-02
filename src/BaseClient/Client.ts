import * as Discord from 'discord.js';
import type Jobs from 'node-schedule';
import type RedisxPSQL from 'pg-x-redis';
import * as ch from './ClientHelper.js';
import NekoClient from './NekoClient.js';
import Constants from './Other/Constants.js';
import ObjectEmotes from './Other/ObjectEmotes.json' assert { type: 'json' };
import StringEmotes from './Other/StringEmotes.json' assert { type: 'json' };
import ReactionEmotes from './Other/ReactionEmotes.json' assert { type: 'json' };
import DataBase from './DataBase.js';
import auth from '../auth.json' assert { type: 'json' };
import type cache from './ClientHelperModules/cache.js';

class CustomClient extends Discord.Client {
  neko: typeof NekoClient;
  customConstants: typeof Constants;
  objectEmotes: typeof ObjectEmotes;
  stringEmotes: typeof StringEmotes;
  reactionEmotes: typeof ReactionEmotes;

  mainID: string;

  channelQueue: Map<string, Map<string, Discord.APIEmbed[]>>;
  channelTimeout: Map<string, Map<string, Jobs.Job>>;

  database: RedisxPSQL;
  ch: typeof ch;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cache: typeof cache;

  constructor(options: Discord.ClientOptions) {
    super(options);
    this.neko = NekoClient;
    this.customConstants = Constants;

    this.objectEmotes = ObjectEmotes;
    this.stringEmotes = StringEmotes;
    this.reactionEmotes = ReactionEmotes;

    this.mainID = '650691698409734151';

    this.channelQueue = new Map();
    this.channelTimeout = new Map();

    this.database = DataBase;
    this.ch = ch;
  }
}

const client = new CustomClient({
  shards: 'auto',
  allowedMentions: {
    parse: ['users'],
    repliedUser: false,
  },
  partials: [
    Discord.Partials.User,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.Reaction,
    Discord.Partials.GuildScheduledEvent,
    Discord.Partials.ThreadMember,
  ],
  failIfNotExists: false,
  presence: {
    status: 'online',
    afk: false,
    activities: [
      { name: 'Starting up!', type: Discord.ActivityType.Streaming, url: Constants.standard.ytURL },
    ],
  },
  intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildModeration,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
    Discord.IntentsBitField.Flags.GuildIntegrations,
    Discord.IntentsBitField.Flags.GuildWebhooks,
    Discord.IntentsBitField.Flags.GuildInvites,
    Discord.IntentsBitField.Flags.GuildVoiceStates,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.DirectMessageReactions,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.GuildScheduledEvents,
    Discord.IntentsBitField.Flags.AutoModerationConfiguration,
    Discord.IntentsBitField.Flags.AutoModerationExecution,
    Discord.IntentsBitField.Flags.GuildMessageTyping,
  ],
  sweepers: {
    messages: {
      interval: 60,
      lifetime: 1_209_600, // 14 days
    },
  },
});

await client.login(auth.token);

export default client;
