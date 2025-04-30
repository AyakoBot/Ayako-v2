import { API as DAPI, Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { CompressionMethod, Encoding, WebSocketManager } from '@discordjs/ws';
import { ActivityType, GatewayIntentBits, PresenceUpdateStatus } from 'discord-api-types/v10';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { cache as RedisCache } from './Redis.js';

const rest = new REST({ api: 'http://nirn:8080/api' });
rest.setToken((process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '');

const gateway = new WebSocketManager({
 rest,
 intents:
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildModeration |
  GatewayIntentBits.GuildExpressions |
  GatewayIntentBits.GuildIntegrations |
  GatewayIntentBits.GuildWebhooks |
  GatewayIntentBits.GuildInvites |
  GatewayIntentBits.GuildVoiceStates |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.DirectMessages |
  GatewayIntentBits.DirectMessageReactions |
  GatewayIntentBits.MessageContent |
  GatewayIntentBits.GuildScheduledEvents |
  GatewayIntentBits.AutoModerationConfiguration |
  GatewayIntentBits.AutoModerationExecution |
  GatewayIntentBits.GuildMessageTyping,
 shardCount: getInfo().TOTAL_SHARDS,
 shardIds: getInfo().SHARD_LIST,
 token: (process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '',
 compression: CompressionMethod.ZlibNative,
 encoding: Encoding.JSON,
 initialPresence: {
  status: PresenceUpdateStatus.Idle,
  afk: true,
  since: Date.now() - 10000,
  activities: [
   {
    state: 'Starting up...',
    name: 'Starting up...',
    type: ActivityType.Custom,
   },
  ],
 },
 useIdentifyCompression: true,
 largeThreshold: 250,
});

gateway.setToken((process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '');

const client = new Client({ rest, gateway });

export const cluster = new ClusterClient(client);
export const cache = RedisCache;
export const API = new DAPI(rest);
export const clientUser = await API.users.getCurrent();

gateway.connect();

export default client;
