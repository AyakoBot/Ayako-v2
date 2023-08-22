import fetch from 'node-fetch';
import * as Jobs from 'node-schedule';
import auth from '../../../../auth.json' assert { type: 'json' };

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

  const res = await fetch(`https://api.fishfish.gg/v1/domains?full=false`, {
   headers: {
    auth: self.sessionToken,
   },
  });
  if (!res.ok) throw new Error('Failed to fetch FishFish API');

  self.cache = new Set();
  const data = (await res.json()) as string[];
  data.forEach((d) => self.cache.add(d));
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
