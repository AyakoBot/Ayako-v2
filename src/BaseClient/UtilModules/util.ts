import { type Base64Resolvable, type BufferResolvable } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import type Stream from 'stream';

/**
 * Returns a string wrapped in a code block.
 * @param text - The string to be wrapped in a code block.
 * @returns A string wrapped in a code block.
 */
export const makeCodeBlock = (text: string) => `\`\`\`${text}\`\`\``;
/**
 * Wraps the given text in inline code markdown.
 * @param text - The text to be wrapped.
 * @returns The text wrapped in inline code markdown.
 */
export const makeInlineCode = (text: string) => `\`${text}\``;
/**
 * Makes the given text bold by wrapping it in double asterisks.
 * @param text - The text to make bold.
 * @returns The bolded text.
 */
export const makeBold = (text: string) => `**${text}**`;
/**
 * Returns the given text wrapped in double underscores to make it underlined.
 * @param text - The text to be underlined.
 * @returns The underlined text.
 */
export const makeUnderlined = (text: string) => `__${text}__`;
/**
 * Wraps the given text in spoiler tags.
 * @param text - The text to be wrapped in spoiler tags.
 * @returns The given text wrapped in spoiler tags.
 */
export const makeSpoiler = (text: string) => `||${text}||`;
/**
 * Extracts the ID and token from a Discord webhook URL.
 * @param text The webhook URL to extract from.
 * @returns An object containing the ID and token.
 */
export const webhookURLToIdAndToken = (text: string) => {
 const [id, token] = text.substring(text.indexOf('webhooks/') + 9).split('/');
 return { id, token };
};

export const resolveImage = async (image: BufferResolvable | Base64Resolvable): Promise<string> => {
 if (typeof image === 'string' && image.startsWith('data:')) {
  return image;
 }

 const file = await resolveFile(image);
 return resolveBase64(file.data);
};

export const resolveFile = async (
 resource: BufferResolvable | Stream,
): Promise<{
 data: BufferResolvable | Base64Resolvable;
 contentType?: string | undefined;
}> => {
 if (Buffer.isBuffer(resource)) return { data: resource };

 // @ts-expect-error
 if (typeof resource[Symbol.asyncIterator] === 'function') {
  const buffers = [];
  // @ts-expect-error
  for await (const data of resource) buffers.push(Buffer.from(data));
  return { data: Buffer.concat(buffers) };
 }

 if (typeof resource === 'string') {
  if (resource.match(/^https?:\/\//)?.length) {
   const res = await fetch(resource);
   return {
    data: Buffer.from(await res.arrayBuffer()),
    contentType: res.headers.get('content-type') || undefined,
   };
  }

  const file = path.resolve(resource);

  const stats = await fs.stat(file);
  if (!stats.isFile()) throw new Error('Fíle now found');
  return { data: await fs.readFile(file) };
 }

 throw new Error('Bad Request Resource Type');
};

function resolveBase64(data: Base64Resolvable) {
 if (Buffer.isBuffer(data)) return `data:image/jpg;base64,${data.toString('base64')}`;
 return data;
}
