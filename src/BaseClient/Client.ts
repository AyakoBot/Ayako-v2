import * as Discord from 'discord.js';
import type Jobs from 'node-schedule';
import type RedisxPSQL from 'pg-x-redis';
import * as ch from './ClientHelper.js';
import NekoClient from './NekoClient.js';
import * as config from '../configs.js';
import Constants from './Other/Constants.js';
import ObjectEmotes from './Other/ObjectEmotes.json' assert { type: 'json' };
import StringEmotes from './Other/StringEmotes.json' assert { type: 'json' };
import ReactionEmotes from './Other/ReactionEmotes.json' assert { type: 'json' };
import eventHandler from '../Events/baseEventHandler.js';
import DataBase from './DataBase.js';

const events: { [key: string]: typeof eventHandler } = {};
Constants.allEvents.forEach((e) => {
  events[e] = eventHandler;
});

class CustomClient extends Discord.Client {
  neko: typeof NekoClient;
  customConstants: typeof Constants;
  objectEmotes: typeof ObjectEmotes;
  stringEmotes: typeof StringEmotes;
  reactionEmotes: typeof ReactionEmotes;

  mainID: bigint;

  channelQueue: Map<bigint, Map<bigint, Discord.MessagePayload[]>>;
  channelTimeout: Map<bigint, Map<bigint, Jobs.Job>>;
  channelCharLimit: Map<bigint, Map<bigint, number>>;

  ch: typeof ch;
  database: RedisxPSQL;

  constructor(options: Discord.ClientOptions) {
    super(options);
    this.neko = NekoClient;
    this.customConstants = Constants;

    this.objectEmotes = ObjectEmotes;
    this.stringEmotes = StringEmotes;
    this.reactionEmotes = ReactionEmotes;

    this.mainID = BigInt(config.BOT_ID);

    this.channelQueue = new Map();
    this.channelTimeout = new Map();
    this.channelCharLimit = new Map();

    this.database = DataBase;
    this.ch = ch;
  }
}

const client = new CustomClient({
  intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildBans,
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
  ],
});

await client.login(config.DISCORD_TOKEN);

export default client;
