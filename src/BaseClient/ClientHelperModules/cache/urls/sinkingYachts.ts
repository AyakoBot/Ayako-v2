import * as Jobs from 'node-schedule';
import fetch from 'node-fetch';
import constants from '../../../Other/constants.js';

/**
 * Interface for the SinkingYachts cache module.
 */
export interface SinkingYachts {
 /**
  * The refresh job for the cache.
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
  * The cache set.
  */
 cache: Set<string>;
}

const self: SinkingYachts = {
 refreshJob: null,
 start: async () => {
  const res = await fetch('https://phish.sinking.yachts/v2/all', {
   headers: {
    'X-Identity': `Discord Bot - Owner ID ${constants.standard.ownerID}`,
   },
  });

  if (!res.ok) throw new Error('Failed to fetch Sinking Yachts API');

  self.refreshJob = Jobs.scheduleJob(new Date(Date.now() + 3600000), () => {
   self.start();
  });

  self.cache = new Set();
  const data = (await res.json()) as string[];
  data.forEach((d) => self.cache.add(d));
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
