import * as fs from 'fs';

const logFile = fs.createWriteStream(
 `${process.cwd()}${
  process.cwd().includes('dist') ? '/..' : ''
 }/logs/console_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
 {
  flags: 'a',
 },
);

export default (l: string | Error, logConsole?: true) => {
 // eslint-disable-next-line no-console
 if (logConsole) console.log(l);

 if (typeof l !== 'string') {
  logFile.write(`${l}\n${l.stack}\n`);
  return;
 }

 // eslint-disable-next-line no-console
 logFile.write(`${l}\n`);
};
