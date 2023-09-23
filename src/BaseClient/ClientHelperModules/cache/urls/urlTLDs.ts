import fetch from 'node-fetch';

/**
 * Interface for UrlTLDs cache module.
 */
export interface UrlTLDs {
 /**
  * Initializes the UrlTLDs cache module.
  * @returns A Promise that resolves when the cache is ready.
  */
 start: () => Promise<void>;
 /**
  * Returns an array of all TLDs in the cache.
  * @returns An array of strings representing TLDs.
  */
 toArray: () => string[];
 /**
  * The cache of TLDs.
  */
 cache: Set<string>;
}

const self: UrlTLDs = {
 start: async () => {
  const res = await fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');
  if (!res.ok) throw new Error('Failed to fetch TLD list');

  self.cache = new Set(
   (await res.text())
    .toLowerCase()
    .split('\n')
    .filter((s) => !s.startsWith('#'))
    .filter((s) => s.length),
  );
 },
 toArray: () => [...self.cache],
 cache: new Set(),
};

export default self;
