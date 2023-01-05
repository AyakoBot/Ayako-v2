// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';

export default async (urls: (string | null)[]) =>
  (
    await Promise.all(
      urls.map((url) =>
        url
          ? fetch(url, { method: 'GET' })
              .then((r) => r.arrayBuffer())
              .catch(() => null)
          : null,
      ),
    )
  )
    .map((buffer, i) => {
      const url = urls[i];
      if (!url) return null;
      const URLObject = new URL(url);
      const fileName = URLObject.pathname.split(/\/+/).pop() || 'unknown';

      if (buffer) {
        return {
          blob: new Blob([buffer], { type: 'application/octet-stream' }),
          name: fileName,
        };
      }
      return null;
    })
    .filter((r) => !!r);
