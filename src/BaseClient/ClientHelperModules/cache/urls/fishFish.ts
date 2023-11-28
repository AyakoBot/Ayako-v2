import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import * as Jobs from 'node-schedule';
import auth from '../../../../auth.json' assert { type: 'json' };
import client from '../../../Client.js';

/**
 * Interface for the FishFish cache module.
 */
export interface FishFish {
 /**
  * The refresh job for the cache module.
  */
 refreshJob: Jobs.Job | null;

 /**
  * Starts the cache module.
  */
 start: () => Promise<void>;

 /**
  * Returns an array of cached URLs.
  * @returns An array of cached URLs.
  */
 toArray: () => string[];

 /**
  * The session token for the cache module.
  */
 sessionToken: string;

 /**
  * The set of cached URLs.
  */
 cache: Set<string>;
}

const self: FishFish = {
 refreshJob: null,
 sessionToken: '',
 start: async () => {
  const authRes = await fetch('https://api.fishfish.gg/v1/users/@me/tokens', {
   method: 'POST',
   headers: {
    authorization: auth.fishToken,
   },
  });
  if (!authRes.ok) throw new Error('Failed to create FishFish Session');

  // expires is a Date in seconds
  const authData = (await authRes.json()) as { token: string; expires: number };
  self.sessionToken = authData.token;
  self.refreshJob = Jobs.scheduleJob(new Date(authData.expires * 1000), () => {
   self.start();
  });

  const res = await fetch(`https://api.fishfish.gg/v1/domains?full=false`, {
   headers: {
    auth: self.sessionToken,
   },
  });
  if (!res.ok) throw new Error('Failed to fetch FishFish API');

  self.cache = new Set();
  const data = (await res.json()) as string[];
  data.forEach((d) => self.cache.add(d));

  const ws = new WebSocket('wss://api.fishfish.gg/v1/stream');
  ws.onmessage = (message) => {
   const msg = JSON.parse(message.data) as { type: 'add' | 'remove'; domains: string[] };

   (client.channels.cache.get('941894692885372928') as Discord.TextChannel).send({
    content: JSON.stringify(msg),
   });

   if (msg.type === 'add') msg.domains.forEach((d) => self.cache.add(d));
   else msg.domains.forEach((d) => self.cache.delete(d));
  };
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
