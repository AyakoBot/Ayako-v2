import * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-unresolved
import enableHelpersPlugin from 'discordeno/helpers-plugin';
import type CT from '../Typings/CustomTypings';
import NekoClient from './NekoClient.js';
import * as config from '../../configs.js';
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

const customizeBot = <B extends DDeno.Bot = DDeno.Bot>(client: B) => {
  const customized = client as unknown as CT.CustomClient;

  customized.mutes = new Map();
  customized.bans = new Map();
  customized.channelBans = new Map();
  customized.reminders = new Map();
  customized.disboardBumpReminders = new Map();
  customized.giveaways = new Map();
  customized.invites = new Map();
  customized.verificationCodes = new Map();
  customized.webhooks = new Map();
  customized.giveawayClaimTimeout = new Map();
  customized.automodRules = new Map();
  customized.emojis = new Map();
  customized.integrations = new Map();
  customized.reactions = new Map();
  customized.roles = new Map();
  customized.channels = new Map();
  customized.guilds = new Map();

  customized.neko = NekoClient;
  customized.customConstants = Constants;

  customized.objectEmotes = ObjectEmotes;
  customized.stringEmotes = StringEmotes;
  customized.reactionEmotes = ReactionEmotes;

  customized.mainID = BigInt(config.BOT_ID);

  customized.channelQueue = new Map();
  customized.channelTimeout = new Map();
  customized.channelCharLimit = new Map();

  customized.database = DataBase;

  return customized;
};

const client = customizeBot(
  enableHelpersPlugin(
    DDeno.createBot({
      events,
      intents: 112383 as DDeno.GatewayIntents,
      token: config.DISCORD_TOKEN,
    }),
  ),
);

client.rest = DDeno.createRestManager({
  token: config.DISCORD_TOKEN,
  secretKey: config.REST_AUTHORIZATION,
  customUrl: config.REST_URL,
});

client.me = await client.helpers.getUser(client.id);

export default client;
