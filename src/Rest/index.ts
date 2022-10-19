import * as DDeno from 'discordeno';
import express, { Request, Response } from 'express';
import auth from '../auth.json' assert { type: 'json' };

const rest = DDeno.createRestManager({
  token: auth.token,
  secretKey: auth.secret,
  customUrl: `http://localhost:${8005}`,
  // eslint-disable-next-line no-console
  debug: console.log,
});

rest.convertRestError = (errorStack, data) => {
  if (!data) return { message: errorStack.message, name: 'convertRestError' };
  return { ...data, message: errorStack.message, name: 'convertRestError' };
};

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.post('/*', async (req, res) => {
  handleRequest(req, res);
});

app.get('/*', async (req, res) => {
  handleRequest(req, res);
});

app.put('/*', async (req, res) => {
  handleRequest(req, res);
});

app.delete('/*', async (req, res) => {
  handleRequest(req, res);
});

app.patch('/*', async (req, res) => {
  handleRequest(req, res);
});

const handleRequest = async (req: Request, res: Response) => {
  if (!auth.secret || auth.secret !== req.headers.authorization) {
    res.status(401).json({ error: 'Invalid authorization key.' });
    return;
  }

  try {
    const result = await rest.runMethod(
      rest,
      req.method as DDeno.RequestMethod,
      `${DDeno.BASE_URL}${req.url}`,
      req.body,
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(204).json();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).json(error);
  }
};

app.listen(8005, () => {
  // eslint-disable-next-line no-console
  console.log(`REST listening at ${rest.customUrl}`);
});
