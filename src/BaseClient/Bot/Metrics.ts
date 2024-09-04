import { InteractionType } from 'discord.js';
import Redis from 'ioredis';
import { scheduleJob } from 'node-schedule';
import { Counter, Gauge, Registry } from 'prom-client';

const redis = new Redis();
const registry = new Registry();

const dispatchEventsReceived = new Counter({
 name: 'ayako_gateway_dispatch_events',
 help: 'Individual dispatch events received',
 labelNames: ['clientName', 'eventType', 'shard'],
});

const shardLatency = new Gauge({
 name: 'ayako_gateway_shard_latency',
 help: 'Latency of each shard',
 labelNames: ['clientName', 'shard'],
});

const shardEventsReceived = new Counter({
 name: 'ayako_gateway_shard_receive_events',
 help: 'Individual shard events received',
 labelNames: ['clientName', 'opCode', 'shard'],
});

const dbQuery = new Counter({
 name: 'ayako_db_query_execute',
 help: 'Individual DB queries executed',
 labelNames: ['modelName', 'action'],
});

const cmdExecuted = new Counter({
 name: 'ayako_command_executed',
 help: 'Individual commands executed',
 labelNames: ['command', 'type', 'context'],
});

const dbLatency = new Gauge({
 name: 'ayako_db_query_latency',
 help: 'Latency of each DB query',
 labelNames: ['modelName', 'action'],
});

const guildCount = new Gauge({
 name: 'ayako_guild_count',
 help: 'Amount of Guilds Ayako is in',
 labelNames: [],
});

const userInstallCount = new Gauge({
 name: 'ayako_user_install_count',
 help: 'Amount of Users Ayako is installed on',
 labelNames: [],
});

const userCount = new Gauge({
 name: 'ayako_user_count',
 help: 'Amount of Users Ayako manages',
 labelNames: [],
});

const emojiCount = new Gauge({
 name: 'ayako_emoji_count',
 help: 'Amount of Emojis Ayako has access to',
 labelNames: [],
});

const roleCount = new Gauge({
 name: 'ayako_role_count',
 help: 'Amount of Roles Ayako has access to',
 labelNames: [],
});

const channelCount = new Gauge({
 name: 'ayako_channel_count',
 help: 'Amount of Channels Ayako has access to',
 labelNames: [],
});

const stickerCount = new Gauge({
 name: 'ayako_sticker_count',
 help: 'Amount of Stickers Ayako has access to',
 labelNames: [],
});

const clusterCount = new Gauge({
 name: 'ayako_cluster_count',
 help: 'Amount of Clusters Ayako is running',
 labelNames: [],
});

const shardCount = new Gauge({
 name: 'ayako_shard_count',
 help: 'Amount of Shards Ayako is running',
 labelNames: [],
});

registry.registerMetric(dispatchEventsReceived);
registry.registerMetric(shardLatency);
registry.registerMetric(shardEventsReceived);
registry.registerMetric(dbQuery);
registry.registerMetric(cmdExecuted);
registry.registerMetric(dbLatency);
registry.registerMetric(dbLatency);
registry.registerMetric(guildCount);
registry.registerMetric(userCount);
registry.registerMetric(emojiCount);
registry.registerMetric(roleCount);
registry.registerMetric(channelCount);
registry.registerMetric(guildCount);
registry.registerMetric(clusterCount);
registry.registerMetric(shardCount);
registry.registerMetric(userInstallCount);


export const metricsCollector = {
 dispatchEventsReceived: (clientName: string, eventType: string, shard: number) =>
  dispatchEventsReceived.labels(clientName, eventType, String(shard)).inc(),

 shardLatency: (clientName: string, shard: number, latency: number) =>
  shardLatency.labels(clientName, String(shard)).set(latency),

 shardEventsReceived: (clientName: string, opCode: string, shard: number) =>
  shardEventsReceived.labels(clientName, opCode, String(shard)).inc(),

 dbQuery: (modelName: string, action: string) => dbQuery.labels(modelName, action).inc(),

 cmdExecuted: (command: string, type: InteractionTypeExtended, context: 0 | 1) =>
  cmdExecuted.labels(command, getInteractionType(type), context === 0 ? 'Guild' : 'User').inc(),

 dbLatency: (modelName: string, action: string, latency: number) =>
  dbLatency.labels(modelName, action).set(latency),

 guildCount: (count: number) => guildCount.labels().set(count),
 userCount: (count: number) => userCount.labels().set(count),
 emojiCount: (count: number) => emojiCount.labels().set(count),
 roleCount: (count: number) => roleCount.labels().set(count),
 channelCount: (count: number) => channelCount.labels().set(count),
 stickerCount: (count: number) => stickerCount.labels().set(count),
 clusterCount: (count: number) => clusterCount.labels().set(count),
 shardCount: (count: number) => shardCount.labels().set(count),
 userInstallCount: (count: number) => userInstallCount.labels().set(count),
};

type InteractionTypeExtended = InteractionType | ExtendedTypes;
enum ExtendedTypes {
 StringCommand = 0,
}

const getInteractionType = (type: InteractionTypeExtended) => {
 switch (type) {
  case ExtendedTypes.StringCommand:
   return 'String-Command';
  case InteractionType.ApplicationCommand:
   return 'Slash-Command';
  case InteractionType.ApplicationCommandAutocomplete:
   return 'Auto-Complete';
  case InteractionType.MessageComponent:
   return 'Message-Component';
  case InteractionType.ModalSubmit:
   return 'Modal-Submit';
  case InteractionType.Ping:
   return 'Ping';
  default:
   return '-';
 }
};

scheduleJob('metrics', '*/5 * * * * *', async () => {
 redis.set(`metrics:Ayako - Manager`, await registry.metrics());
});
