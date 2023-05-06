// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';

export default async (url: string) => {
 if (!new URL(url).pathname.endsWith('.txt')) return null;

 const text = await fetch(url, { method: 'GET' })
  .then((r) => r.text())
  .catch(() => null);

 if (!text) return null;
 return text;
};
