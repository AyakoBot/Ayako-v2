import { Collection, createBot, createGatewayManager, createRestManager } from 'discordeno';
// eslint-disable-next-line import/no-unresolved
import { createLogger } from 'discordeno/logger';
import fastify from 'fastify';
import { nanoid } from 'nanoid';
import { Worker } from 'worker_threads';
import * as config from '../configs.js';
import type * as WorkerThreads from './worker.js';

async function main() {
  const log = createLogger({ name: '[MANAGER]' });

  const bot = createBot({
    token: config.DISCORD_TOKEN,
  });

  bot.rest = createRestManager({
    token: config.DISCORD_TOKEN,
    secretKey: config.REST_AUTHORIZATION,
    customUrl: config.REST_URL,
  });

  const gatewayBot = await bot.helpers.getGatewayBot();

  const gateway = createGatewayManager({
    gatewayBot,
    gatewayConfig: {
      token: config.DISCORD_TOKEN,
      intents: config.INTENTS,
    },
    totalShards: config.TOTAL_SHARDS,
    shardsPerWorker: config.SHARDS_PER_WORKER,
    totalWorkers: config.TOTAL_WORKERS,

    handleDiscordPayload: () => {
      // empty
    },

    tellWorkerToIdentify: async (_gateway, workerId, shardId, _bucketId) => {
      log.info('TELL TO IDENTIFY', { workerId, shardId, _bucketId });

      let worker = workers.get(workerId);
      if (!worker) {
        worker = createWorker(workerId);
        workers.set(workerId, worker);
      }

      const identify: WorkerThreads.WorkerMessage = {
        type: 'IDENTIFY_SHARD',
        shardId,
      };

      worker.postMessage(identify);
    },
  });

  const workers = new Collection<number, Worker>();
  // eslint-disable-next-line no-spaced-func
  const nonces = new Collection<
    // eslint-disable-next-line func-call-spacing
    string,
    (data: PromiseLike<WorkerThreads.WorkerShardInfo[]> | WorkerThreads.WorkerShardInfo[]) => void
  >();

  function createWorker(workerId: number) {
    // eslint-disable-next-line no-console
    console.log(config.TOTAL_SHARDS, gateway.manager.totalShards, 'SHARDS');

    const workerData: WorkerThreads.WorkerCreateData = {
      intents: gateway.manager.gatewayConfig.intents ?? 0,
      token: config.DISCORD_TOKEN,
      handlerUrls: [config.EVENT_HANDLER_URL],
      handlerAuthorization: config.EVENT_HANDLER_AUTHORIZATION,
      path: './worker.ts',
      totalShards: gateway.manager.totalShards,
      workerId,
    };

    const worker = new Worker('./worker.js', {
      workerData,
    });

    worker.on('message', async (data: ManagerMessage) => {
      log.info({ data });
      switch (data.type) {
        case 'REQUEST_IDENTIFY': {
          log.info('REQUESTING IDENTIFY #', data.shardId);
          await gateway.manager.requestIdentify(data.shardId);

          const allowIdentify: WorkerThreads.WorkerMessage = {
            type: 'ALLOW_IDENTIFY',
            shardId: data.shardId,
          };

          worker.postMessage(allowIdentify);

          break;
        }
        case 'NONCE_REPLY': {
          nonces.get(data.nonce)?.(data.data);
          break;
        }
        default: {
          break;
        }
      }
    });

    return worker;
  }

  gateway.spawnShards();

  const server = fastify();

  server.post('/', async (request, reply) => {
    if (request.headers.authorization !== config.GATEWAY_AUTHORIZATION) {
      reply.code(StatusCodes.Unauthorized);

      return reply.send({
        processing: false,
        error: false,
        message: 'Invalid authorization header.',
      });
    }

    if (!request.body) {
      reply.code(StatusCodes.BadRequest);

      return reply.send({ processing: false, error: false, message: 'Empty body.' });
    }

    try {
      const data = request.body as
        | WorkerThreads.WorkerShardPayload
        | Omit<WorkerThreads.WorkerGetShardInfo, 'nonce'>;
      switch (data.type) {
        case 'SHARD_PAYLOAD': {
          const workerId = gateway.calculateWorkerId(data.shardId);
          const worker = workers.get(workerId);

          worker?.postMessage(data);

          break;
        }
        case 'GET_SHARD_INFO': {
          const infos = await Promise.all(
            workers.map(async (worker) => {
              const nonce = nanoid();

              return new Promise<WorkerThreads.WorkerShardInfo[]>((resolve) => {
                worker.postMessage({ type: 'GET_SHARD_INFO', nonce });

                nonces.set(nonce, resolve);
              });
            }),
          ).then((res) =>
            res.reduce((acc, cur) => {
              acc.push(...cur);
              return acc;
            }, [] as WorkerThreads.WorkerShardInfo[]),
          );

          reply.code(StatusCodes.Ok);

          return reply.send(infos);
        }
        default: {
          break;
        }
      }

      reply.code(StatusCodes.Ok);

      return reply.send({ processing: true });
    } catch {
      reply.code(StatusCodes.BadRequest);

      return reply.send({ processing: false, error: true, message: 'Failed to parse body.' });
    }
  });

  server.listen({ host: config.GATEWAY_HOST, port: config.GATEWAY_PORT }).catch((error) => {
    log.error(['[FASTIFY ERROR', error].join('\n'));
    process.exit(1);
  });
}

main();

export type ManagerMessage =
  | ManagerRequestIdentify
  | ManagerNonceReply<WorkerThreads.WorkerShardInfo[]>;

export type ManagerRequestIdentify = {
  type: 'REQUEST_IDENTIFY';
  shardId: number;
};

export type ManagerNonceReply<T> = {
  type: 'NONCE_REPLY';
  nonce: string;
  data: T;
};

const StatusCodes = {
  Ok: 200,
  BadRequest: 400,
  Unauthorized: 401,
  InternalServerError: 500,
};
