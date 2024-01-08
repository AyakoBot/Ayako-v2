import fetch from 'node-fetch';

/**
 * Recursively fetches a URL and its redirects, returning an array of visited URLs.
 * @param url - The URL to fetch.
 * @param visited - An optional array of visited URLs.
 * @returns An array of visited URLs.
 */
const self = async (url: string, visited: string[] = []): Promise<string[]> => {
 if (!url.startsWith('http')) url = `http://${url}`;
 visited.push(url);

 const response = await fetch(url, { redirect: 'manual' }).catch(() => undefined);

 if (response?.status === 301 || response?.status === 302) {
  const location = response.headers.get('location');
  if (location && !visited.includes(location)) return self(location, visited);
 }

 return visited;
};

export default self;
