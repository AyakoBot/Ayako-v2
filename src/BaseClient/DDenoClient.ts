import * as DDeno from 'discordeno';
import type CT from '../Typings/CustomTypings';
import NekoClient from './NekoClient';
import auth from './auth.json' assert { type: 'json' };
import Constants from './Other/Constants.json' assert { type: 'json' };
import ObjectEmotes from './Other/ObjectEmotes.json' assert { type: 'json' };
import StringEmotes from './Other/StringEmotes.json' assert { type: 'json' };
import ReactionEmotes from './Other/ReactionEmotes.json' assert { type: 'json' };
import constants from './Other/Constants.json' assert { type: 'json' };
import eventHandler from '../Events/baseEventHandler';

const events: { [key: string]: typeof eventHandler } = {};
constants.allEvents.forEach((e) => (events[e] = eventHandler));

const client = DDeno.createBot({
  events,
  intents: 112383,
  token: auth.token,
  botId: BigInt(auth.clientID),
  applicationId: BigInt(auth.clientID),
}) as CT.CustomClient;

client.mutes = new Map();
client.bans = new Map();
client.channelBans = new Map();
client.reminders = new Map();
client.disboardBumpReminders = new Map();
client.giveaways = new Map();
client.invites = new Map();
client.verificationCodes = new Map();
client.webhooks = new Map();
client.giveawayClaimTimeout = new Map();

client.neko = NekoClient;
client.customConstants = Constants;

client.objectEmotes = ObjectEmotes;
client.stringEmotes = StringEmotes;
client.reactionEmotes = ReactionEmotes;

client.mainID = BigInt(auth.clientID);

client.channelQueue = new Map();
client.channelTimeout = new Map();
client.channelCharLimit = new Map();

DDeno.startBot(client).then(() => {
  // eslint-disable-next-line no-console
  console.log(`| Discord Client connected at ${new Date().toUTCString()}`);
});

export default client;
