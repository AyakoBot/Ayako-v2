export default (array: string[], source?: string) => {
  if (!array.length) return null;

  const now = Date.now();
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

  const buffer = Buffer.from(content, 'utf-8');
  const attachment = { file: buffer, name: `${now}.txt` };

  return attachment;
};
