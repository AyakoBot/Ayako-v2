import { getBotIdFromToken, Intents } from 'discordeno';
import auth from './auth.json' assert { type: 'json' };

export const DEVELOPMENT = true;
export const DEV_SERVER_ID = '669893888856817665';
export const DISCORD_TOKEN = auth.token;
export const BOT_ID = getBotIdFromToken(DISCORD_TOKEN);
export const EVENT_HANDLER_AUTHORIZATION = auth.secret;
export const EVENT_HANDLER_PORT = 8006;
export const EVENT_HANDLER_URL = `http://localhost:${EVENT_HANDLER_PORT}`;
export const MISSING_TRANSLATION_WEBHOOK = auth.debugWebhook;
export const BUGS_ERRORS_REPORT_WEBHOOK = auth.debugWebhook;
export const REST_AUTHORIZATION = auth.secret;
export const REST_PORT = 8005;
export const REST_URL = `http://localhost:${REST_PORT}`;
export const INTENTS: Intents =
  Intents.DirectMessageReactions |
  Intents.DirectMessages |
  Intents.GuildBans |
  Intents.GuildEmojis |
  Intents.GuildIntegrations |
  Intents.GuildInvites |
  Intents.GuildMembers |
  Intents.GuildMessageReactions |
  Intents.GuildMessages |
  Intents.GuildVoiceStates |
  Intents.GuildWebhooks |
  Intents.Guilds |
  Intents.MessageContent |
  Intents.GuildScheduledEvents;
export const TOTAL_SHARDS: number | undefined = undefined;
export const SHARDS_PER_WORKER = 16;
// CPU Cores or less.
export const TOTAL_WORKERS = 4;
export const GATEWAY_AUTHORIZATION = auth.secret;
export const GATEWAY_HOST = 'localhost';
export const GATEWAY_PORT = 8007;
export const GATEWAY_URL = `${GATEWAY_HOST}:${GATEWAY_PORT}`;
