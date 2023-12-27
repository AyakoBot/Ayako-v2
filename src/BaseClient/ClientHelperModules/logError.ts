import * as fs from 'fs';

const logFile = fs.createWriteStream(
 `${process.cwd()}/../logs/console_${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
 {
  flags: 'a',
 },
);

export default (l: string | Error, logConsole?: true) => {
 // eslint-disable-next-line no-console
 if (logConsole) console.log(l);
 logFile.write(`${l}\n`);
};
