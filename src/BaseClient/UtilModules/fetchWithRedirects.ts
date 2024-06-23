import fetch from 'node-fetch';

/**
 * Recursively fetches a URL and its redirects, returning an array of visited URLs.
 * @param url - The URL to fetch.
 * @param visited - An optional array of visited URLs.
 * @returns An array of visited URLs.
 */
const self = async (url: string, visited: string[] = []): Promise<string[]> => {
 if (!url.startsWith('http')) url = `http://${url}`;

 const response = await fetch(url, { redirect: 'manual' }).catch(() => undefined);
 const symbols = response ? Object.getOwnPropertySymbols(response) : [];
 const resInternals =
  symbols.length && response
   ? (response[symbols[1] as unknown as keyof typeof response] as unknown as typeof response)
   : undefined;

 if (response && [301, 302, 307, 308].includes(response.status)) {
  const location = response.headers.get('location');
  if (location && !visited.includes(location)) return self(location, visited);
 }

 if (resInternals && [301, 302, 307, 308].includes(resInternals.status)) {
  const location = resInternals.headers.get('location');
  if (location && !visited.includes(location)) return self(location, visited);
 }

 return visited;
};

export default self;
