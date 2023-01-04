import type * as DDeno from 'discordeno';

export default (array: string[], source?: string, name = String(Date.now())) => {
  if (!array.length) return null;

  let content = '';
  const split = '\n';

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

  const blob = new Blob([content], { type: 'text/plain' });
  const attachment: DDeno.FileContent = { blob, name: `${name}.txt` };

  return attachment;
};
