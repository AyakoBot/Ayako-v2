import fetch from 'node-fetch';
import io from 'socket.io-client';
import constants from '../../../Other/constants.js';

const reason = `Discord Bot - Owner ID ${constants.standard.ownerID}`;

export const socket = io('wss://phish.sinking.yachts/feed', { auth: { 'X-Identitiy': reason } });

socket.on('message', (args: { type: 'add' | 'delete'; domains: string[] }) => {
 console.log(args);
 if (!['add', 'delete'].includes(args.type)) return;

 const fn = args.type === 'add' ? self.cache.add : self.cache.delete;
 args.domains.forEach((d) => fn(d));
});

export interface SinkingYachts {
 start: () => Promise<void>;
 toArray: () => string[];
 cache: Set<string>;
}

const self: SinkingYachts = {
 start: async () => {
  const res = await fetch('https://phish.sinking.yachts/v2/all', {
   headers: {
    'X-Identity': reason,
   },
  });

  if (!res.ok) throw new Error('Failed to fetch Sinking Yachts API');

  const data = (await res.json()) as string[];
  data.forEach((d) => self.cache.add(d));
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
