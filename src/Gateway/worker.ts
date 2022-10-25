import fetch from 'node-fetch';
import * as DDeno from 'discordeno';
// eslint-disable-next-line import/no-unresolved
import { createLogger } from 'discordeno/logger';
import { parentPort, workerData } from 'worker_threads';
import type { ManagerMessage } from './gateway.js';

if (!parentPort) {
  throw new Error('Parent port is null');
}

const script: WorkerCreateData = workerData;

const log = createLogger({ name: `[WORKER #${script.workerId}]` });

// eslint-disable-next-line func-call-spacing, no-spaced-func
const identifyPromises = new Map<number, () => void>();

const guildIds: Set<bigint> = new Set();
const loadingGuildIds: Set<bigint> = new Set();

const manager = DDeno.createShardManager({
  gatewayConfig: {
    intents: script.intents,
    token: script.token,
  },
  shardIds: [],
  totalShards: script.totalShards,
  handleMessage: async (shard, message) => {
    const url = script.handlerUrls[shard.id % script.handlerUrls.length];
    if (!url) {
      // eslint-disable-next-line no-console
      console.log('ERROR: NO URL FOUND TO SEND MESSAGE');
      return;
    }

    if (message.t === 'READY') {
      (message.d as DDeno.DiscordReady).guilds.forEach((g) => loadingGuildIds.add(BigInt(g.id)));
    }

    if (message.t === 'GUILD_CREATE') {
      const guild = message.d as DDeno.DiscordGuild;
      const id = BigInt(guild.id);

      const existing = guildIds.has(id);
      if (existing) return;

      if (loadingGuildIds.has(id)) {
        (message.t as DDeno.GatewayEventNames | 'GUILD_LOADED_DD') = 'GUILD_LOADED_DD';

        loadingGuildIds.delete(id);
      }

      guildIds.add(id);
    }

    if (message.t === 'GUILD_DELETE') {
      const guild = message.d as DDeno.DiscordUnavailableGuild;

      if (guild.unavailable) return;

      guildIds.delete(BigInt(guild.id));
    }

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ message, shardId: shard.id }),
      headers: { 'Content-Type': 'application/json', Authorization: script.handlerAuthorization },
    }).catch((error) => log.error(error));

    log.debug({ shardId: shard.id, message });
  },
  requestIdentify: (shardId: number): Promise<void> =>
    new Promise((resolve) => {
      identifyPromises.set(shardId, resolve);

      const identifyRequest: ManagerMessage = {
        type: 'REQUEST_IDENTIFY',
        shardId,
      };

      parentPort?.postMessage(identifyRequest);
    }),
});

const buildShardInfo = (shard: DDeno.Shard): WorkerShardInfo => ({
  workerId: script.workerId,
  shardId: shard.id,
  rtt: shard.heart.rtt || -1,
  state: shard.state,
});

parentPort.on('message', async (data: WorkerMessage) => {
  switch (data.type) {
    case 'IDENTIFY_SHARD': {
      log.info(`starting to identify shard #${data.shardId}`);
      await manager.identify(data.shardId);

      break;
    }
    case 'ALLOW_IDENTIFY': {
      identifyPromises.get(data.shardId)?.();
      identifyPromises.delete(data.shardId);

      break;
    }
    case 'SHARD_PAYLOAD': {
      manager.shards.get(data.shardId)?.send(data.data);

      break;
    }
    case 'GET_SHARD_INFO': {
      const infos = manager.shards.map(buildShardInfo);

      parentPort?.postMessage({ type: 'NONCE_REPLY', nonce: data.nonce, data: infos });
      break;
    }
    default: {
      break;
    }
  }
});

export type WorkerMessage =
  | WorkerIdentifyShard
  | WorkerAllowIdentify
  | WorkerShardPayload
  | WorkerGetShardInfo;

export type WorkerIdentifyShard = {
  type: 'IDENTIFY_SHARD';
  shardId: number;
};

export type WorkerAllowIdentify = {
  type: 'ALLOW_IDENTIFY';
  shardId: number;
};

export type WorkerShardPayload = {
  type: 'SHARD_PAYLOAD';
  shardId: number;
  data: DDeno.ShardSocketRequest;
};

export type WorkerGetShardInfo = {
  type: 'GET_SHARD_INFO';
  nonce: string;
};

export type WorkerCreateData = {
  intents: number;
  token: string;
  handlerUrls: string[];
  handlerAuthorization: string;
  path: string;
  totalShards: number;
  workerId: number;
};

export type WorkerShardInfo = {
  workerId: number;
  shardId: number;
  rtt: number;
  state: DDeno.ShardState;
};
