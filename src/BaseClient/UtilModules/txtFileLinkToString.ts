/**
 * Fetches the contents of a text file from a given URL and returns it as a string.
 * @param url - The URL of the text file to fetch.
 * @returns A Promise that resolves to the contents of the text file as a string,
 * or null if the URL is invalid or the file cannot be fetched.
 */
export default async (url: string) => {
 if (!new URL(url).pathname.endsWith('.txt')) return null;

 const text = await fetch(url, { method: 'GET' })
  .then((r) => r.text())
  .catch(() => null);

 if (!text) return null;
 return text;
};
