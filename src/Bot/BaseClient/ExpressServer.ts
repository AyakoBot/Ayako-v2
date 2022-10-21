import Express from 'express';
import bodyParser from 'body-parser';
import type * as DDeno from 'discordeno';
import client from './DDenoClient.js';
import * as config from '../../configs.js';

const app = Express();

app.use(
  Express.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json({ limit: '25mb' }));
app.use(Express.json());

app.post('/', async (req, res) => {
  handleRequest(req, res);
});

app.put('/', async (req, res) => {
  handleRequest(req, res);
});

app.patch('/', async (req, res) => {
  handleRequest(req, res);
});

app.delete('/', async (req, res) => {
  handleRequest(req, res);
});

app.get('/', async (req, res) => {
  handleRequest(req, res);
});

const handleRequest = async (req: Express.Request, res: Express.Response) => {
  try {
    if (
      !config.EVENT_HANDLER_AUTHORIZATION ||
      config.EVENT_HANDLER_AUTHORIZATION !== req.headers.authorization
    ) {
      res.status(401).json({ error: 'Invalid authorization key.' });
      return;
    }

    const json = req.body as {
      message: DDeno.DiscordGatewayPayload;
      shardId: number;
    };

    client.events.raw(client, json.message, json.shardId);

    if (json.message.t && json.message.t !== 'RESUMED') {
      if (!['READY', 'GUILD_LOADED_DD'].includes(json.message.t)) {
        await client.events.dispatchRequirements(client, json.message, json.shardId);
      }

      client.handlers[json.message.t]?.(client, json.message, json.shardId);
    }

    res.status(200).json({ success: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(error.code).json(error);
  }
};

app.listen(config.EVENT_HANDLER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Client is listening at ${config.EVENT_HANDLER_URL};`);
});
