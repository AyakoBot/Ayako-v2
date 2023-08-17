import fetch from 'node-fetch';
import io from 'socket.io-client';
import * as Jobs from 'node-schedule';
import auth from '../../../../auth.json' assert { type: 'json' };

const initSocket = () => {
 const socket = io('wss://api.fishfish.gg/v1/stream', {
  auth: {
   authorization: self.sessionToken,
  },
 });

 socket.on('message', (args: { type: 'add' | 'delete'; domains: string[] }) => {
  console.log(args);

  const fn = args.type === 'add' ? self.cache.add : self.cache.delete;
  args.domains.forEach((d) => fn(d));
 });
};

export interface FishFish {
 refreshJob: Jobs.Job | null;
 start: () => Promise<void>;
 toArray: () => string[];
 sessionToken: string;
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

  initSocket();

  setTimeout(async () => {
   const res = await fetch(`https://api.fishfish.gg/v1/domains?full=false`, {
    headers: {
     auth: self.sessionToken,
    },
   });
   if (!res.ok) throw new Error('Failed to fetch FishFish API');

   self.cache = new Set();
   const data = (await res.json()) as string[];
   data.forEach((d) => self.cache.add(d));
  }, 20000);
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
