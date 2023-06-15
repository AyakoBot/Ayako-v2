import type * as Discord from 'discord.js';

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
