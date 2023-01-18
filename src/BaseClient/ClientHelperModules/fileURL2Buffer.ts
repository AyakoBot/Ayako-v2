// eslint-disable-next-line no-shadow
import fetch from 'node-fetch';
import type * as Discord from 'discord.js';
import arrayBufferToBuffer from './arrayBufferToBuffer.js';

export default async (
  urls: (string | null)[],
  names?: string[],
): Promise<(Discord.AttachmentPayload | null)[]> =>
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
    .map((arrayBuffer, i) => {
      const url = urls[i];
      if (!url) return null;

      if (!arrayBuffer) return null;
      const buffer = arrayBufferToBuffer(arrayBuffer);

      const URLObject = new URL(url);
      const fileName = names?.length
        ? names[i]
        : URLObject.pathname.split(/\/+/).pop() || 'unknown';

      return {
        attachment: buffer,
        name: fileName,
      };
      return null;
    })
    .filter((r) => !!r);
