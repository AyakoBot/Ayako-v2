import fs from 'fs';

export default () => {
  const paths: string[] = [];

  const eventsDir = fs.readdirSync(`${process.cwd()}/Events`);

  eventsDir.forEach((folder) => {
    if (isDisallowed(folder)) return;

    if (folder.includes('.')) {
      const path = `${process.cwd()}/Events/${folder}`;
      paths.push(path);

      return;
    }

    const key = folder.replace(/events/gi, '');
    const eventFiles = fs.readdirSync(`${process.cwd()}/Events/${folder}`);

    eventFiles.forEach((file) => {
      if (isDisallowed(file)) return;

      if (file.includes('.') && file.startsWith(key)) {
        const path = `${process.cwd()}/Events/${folder}/${file}`;
        paths.push(path);

        return;
      }

      if (file.startsWith(key) && !file.includes('.')) {
        fs.readdirSync(`${process.cwd()}/Events/${folder}/${file}`).forEach((eventFolderFile) => {
          if (isDisallowed(eventFolderFile)) return;

          if (String(eventFolderFile).includes('.') && String(eventFolderFile).startsWith(key)) {
            const path = `${process.cwd()}/Events/${folder}/${file}/${eventFolderFile}`;

            paths.push(path);
          }
        });
      }
    });
  });

  return paths;
};

const isDisallowed = (file: string) =>
  ['.d.ts', '.d.ts.map', '.js.map'].some((end) => file.endsWith(end));
