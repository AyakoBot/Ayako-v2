import fetch from 'node-fetch';

export interface UrlTLDs {
 start: () => Promise<void>;
 toArray: () => string[];
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
