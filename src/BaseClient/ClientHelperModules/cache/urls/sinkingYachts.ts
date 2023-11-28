import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import constants from '../../../Other/constants.js';
import client from '../../../Client.js';

/**
 * Interface for the SinkingYachts cache module.
 */
export interface SinkingYachts {
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
  * The cache set.
  */
 cache: Set<string>;
}

const self: SinkingYachts = {
 start: async () => {
  const res = await fetch('https://phish.sinking.yachts/v2/all', {
   headers: {
    'X-Identity': `Discord Bot - Owner ID ${constants.standard.ownerID}`,
   },
  });

  if (!res.ok) throw new Error('Failed to fetch Sinking Yachts API');

  self.cache = new Set();
  const data = (await res.json()) as string[];
  data.forEach((d) => self.cache.add(d));

  const ws = new WebSocket('wss://phish.sinking.yachts/feed');
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
