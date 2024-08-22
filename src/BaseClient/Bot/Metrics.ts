import Redis from 'ioredis';
import { scheduleJob } from 'node-schedule';
import { Counter, Gauge, Registry } from 'prom-client';

const redis = new Redis();

export const registry = new Registry();

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
 labelNames: ['modelName', 'action', 'where'],
});

registry.registerMetric(dispatchEventsReceived);
registry.registerMetric(shardLatency);
registry.registerMetric(shardEventsReceived);
registry.registerMetric(dbQuery);

export const metrics = {
 dispatchEventsReceived,
 shardLatency,
 shardEventsReceived,
 dbQuery,
};

export const metricsCollector = {
 dispatchEventsReceived: (clientName: string, eventType: string, shard: number) => {
  metrics.dispatchEventsReceived.labels(clientName, eventType, String(shard)).inc();
 },
 shardLatency: (clientName: string, shard: number, latency: number) => {
  metrics.shardLatency.labels(clientName, String(shard)).set(latency);
 },
 shardEventsReceived: (clientName: string, opCode: string, shard: number) => {
  metrics.shardEventsReceived.labels(clientName, opCode, String(shard)).inc();
 },
 dbQuery: (modelName: string, action: string, where: string) => {
  metrics.dbQuery.labels(modelName, action, where).inc();
 },
};

scheduleJob('metrics', '*/5 * * * * *', async () => {
 redis.set(`metrics:Ayako - Manager`, await registry.metrics());
});
