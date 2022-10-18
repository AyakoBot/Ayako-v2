import fs from 'fs';
import ClientEmitter from '../BaseClient/Other/ClientEmitter';

const getEvents = () => {
  const paths: string[] = [];

  const eventsDir = fs.readdirSync(`${process.cwd()}/dist/Events`);

  eventsDir.forEach((folder) => {
    if (isDisallowed(folder)) return;

    if (folder.includes('.')) {
      const path = `${process.cwd()}/dist/Events/${folder}`;
      paths.push(path);

      return;
    }

    const key = folder.replace(/events/gi, '');
    const eventFiles = fs.readdirSync(`${process.cwd()}/dist/Events/${folder}`);

    eventFiles.forEach((file) => {
      if (isDisallowed(file)) return;

      if (file.includes('.') && file.startsWith(key)) {
        const path = `${process.cwd()}/dist/Events/${folder}/${file}`;
        paths.push(path);

        return;
      }

      if (file.startsWith(key) && !file.includes('.')) {
        fs.readdirSync(`${process.cwd()}/dist/Events/${folder}/${file}`).forEach(
          (eventFolderFile) => {
            if (isDisallowed(eventFolderFile)) return;

            if (String(eventFolderFile).includes('.') && String(eventFolderFile).startsWith(key)) {
              const path = `${process.cwd()}/dist/Events/${folder}/${file}/${eventFolderFile}`;

              paths.push(path);
            }
          },
        );
      }
    });
  });

  return paths;
};

const isDisallowed = (file: string) =>
  ['.d.ts', '.d.ts.map', '.js.map'].some((end) => file.endsWith(end));

export default async (...args: unknown[]) => {
  const { stack } = new Error();
  if (!stack) return;

  const relevantEntry = stack.split(/\n/g)[2];
  if (!relevantEntry) return;

  const as = relevantEntry.split('as ')[1];
  if (!as) return;

  const eventName = as.split(']')[0];
  if (!eventName) return;

  const splitEventName = eventName.split(/_/g);
  const formattedEventName = splitEventName
    .map((s) => s.charAt(0) + s.slice(1).toLowerCase())
    .join('');
  const finishedEventName =
    formattedEventName.charAt(0).toLowerCase() + formattedEventName.slice(1);

  ClientEmitter.emit(finishedEventName, args);

  const path = getEvents().find((p) => p.endsWith(`${finishedEventName}.js`));
  if (!path) return;

  const eventToRun = (await import(path)).default;
  eventToRun(args);
};
