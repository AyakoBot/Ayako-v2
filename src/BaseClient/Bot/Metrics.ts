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
 labelNames: ['modelName', 'action', 'Guild', 'User', 'Executor', 'UTS', 'Channel'],
});

const cmdExecuted = new Counter({
 name: 'ayako_command_executed',
 help: 'Individual commands executed',
 labelNames: ['command', 'type', 'context', 'guild', 'user'],
});

registry.registerMetric(dispatchEventsReceived);
registry.registerMetric(shardLatency);
registry.registerMetric(shardEventsReceived);
registry.registerMetric(dbQuery);
registry.registerMetric(cmdExecuted);

export const metricsCollector = {
 dispatchEventsReceived: (clientName: string, eventType: string, shard: number) =>
  dispatchEventsReceived.labels(clientName, eventType, String(shard)).inc(),

 shardLatency: (clientName: string, shard: number, latency: number) =>
  shardLatency.labels(clientName, String(shard)).set(latency),

 shardEventsReceived: (clientName: string, opCode: string, shard: number) =>
  shardEventsReceived.labels(clientName, opCode, String(shard)).inc(),

 dbQuery: (
  modelName: string,
  action: string,
  guild?: string,
  user?: string,
  executor?: string,
  uts?: string,
  channel?: string,
 ) =>
  dbQuery
   .labels(
    modelName,
    action,
    guild ?? '-',
    user ?? '-',
    executor ?? '-',
    uts ?? '-',
    channel ?? '-',
   )
   .inc(),

 cmdExecuted: (
  command: string,
  type: InteractionTypeExtended,
  context: 0 | 1,
  user: string,
  guild?: string,
 ) =>
  cmdExecuted
   .labels(command, getInteractionType(type), context === 0 ? 'Guild' : 'User', guild ?? '-', user)
   .inc(),
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
