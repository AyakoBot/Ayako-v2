import type * as Discord from 'discord.js';

/**
 * Returns a Discord attachment payload for a text file.
 * @param array - An array of strings to be written to the file.
 * If a string is passed, it will be written as is.
 * @param source - Optional. A string indicating the source of the array.
 * Used to format the output differently for different sources.
 * @param name - Optional. A string to be used as the filename. Defaults to the current timestamp.
 * @returns A Discord attachment payload object containing the text file.
 */
export default (array: string[] | string, source?: string, name = String(Date.now())) => {
 let content = '';
 const split = '\n';

 if (Array.isArray(array)) {
  switch (source) {
   case 'antiraid': {
    array.forEach((element, i) => {
     content += `${element}${i % 3 === 2 ? split : ' '}`;
    });
    break;
   }
   default: {
    break;
   }
  }

  if (!content.length) {
   array.forEach((element) => {
    content += `${element}${split}`;
   });
  }
 } else content = array;

 const buffer = Buffer.from(content, 'utf-8');
 const attachment: Discord.AttachmentPayload = {
  attachment: buffer,
  name: `${name}.txt`,
 };

 return attachment;
};
