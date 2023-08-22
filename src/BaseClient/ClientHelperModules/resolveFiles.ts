import * as Discord from 'discord.js';
import Stream from 'node:stream';
import { basename, DataResolver } from 'discord.js';

export default (
 files: (Discord.AttachmentPayload | Discord.BufferResolvable | Stream)[],
): Promise<Discord.RawFile[]> => Promise.all(files?.map((file) => resolveFile(file)) ?? []);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveFile = async (fileLike: any): Promise<Discord.RawFile> => {
 let attachment;
 let name;

 const findName = (thing: string | { path: string }) => {
  if (typeof thing === 'string') {
   return basename(thing);
  }

  if (thing.path) {
   return basename(thing.path);
  }

  return 'file.jpg';
 };

 const ownAttachment =
  typeof fileLike === 'string' ||
  fileLike instanceof Buffer ||
  // eslint-disable-next-line @typescript-eslint/ban-types
  typeof (fileLike as { pipe: Function }).pipe === 'function';
 if (ownAttachment) {
  attachment = fileLike;
  name = findName(attachment as Parameters<typeof findName>[0]);
 } else {
  attachment = fileLike.attachment;
  name = fileLike.name ?? findName(attachment);
 }

 const { data, contentType } = await DataResolver.resolveFile(attachment);
 return { data, name, contentType };
};
