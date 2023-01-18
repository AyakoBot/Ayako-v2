import type * as Discord from 'discord.js';

export default (array: string[] | string, source?: string, name = String(Date.now())) => {
  if (!array.length) return undefined;

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

  const blob = new Blob([content], { type: 'text/plain' });
  const attachment: DDeno.FileContent = { blob, name: `${name}.txt` };

  return attachment;
};
