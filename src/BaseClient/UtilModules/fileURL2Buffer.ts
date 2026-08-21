import type * as Discord from 'discord.js';
import arrayBufferToBuffer from './arrayBufferToBuffer.js';
import getNameAndFileType from './getNameAndFileType.js';

/**
 * Converts an array of file URLs to an array of Discord attachment payloads.
 * @param urls An array of file URLs to convert.
 * @param names An optional array of names to use for the attachments.
 * @returns An array of Discord attachment payloads.
 */
export default async <T extends boolean = false>(
 urls: (string | null)[],
 names?: string[],
 force: T = false as T,
): Promise<T extends false ? (string | null)[] : Discord.AttachmentPayload[]> => {
 if (!force) return urls as T extends false ? (string | null)[] : Discord.AttachmentPayload[];

 return (
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
   const fileName = names?.length ? names[i] : getNameAndFileType(url);

   return {
    attachment: buffer,
    name: fileName,
   };
  })
  .filter(
   (r): r is { attachment: Buffer<ArrayBuffer>; name: string | undefined } => !!r,
  ) as T extends false ? (string | null)[] : Discord.AttachmentPayload[];
};
