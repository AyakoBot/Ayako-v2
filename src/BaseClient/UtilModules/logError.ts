import * as fs from 'fs';
import chalk from 'chalk';

const getDebugInfo = () => {
 const dateObject = new Date();

 // Time in the Format: HH:MM:SS AM/PM
 const time = dateObject.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
 });
 // Unix Timestamp
 const timestamp = dateObject.getTime();

 return chalk.gray(`[${time} ${timestamp}]`);
};

const logFile = fs.createWriteStream(
 `${process.cwd()}${
  process.cwd().includes('dist') ? '/..' : ''
 }/logs/console_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
 { flags: 'a' },
);

export default (l: string | Error, logConsole: boolean) => {
 // eslint-disable-next-line no-console
 if (logConsole) console.log(`${getDebugInfo()}${String(l).includes('\n') ? '\n' : ' '}${l}`);

 if (typeof l !== 'string') {
  logFile.write(`$${getDebugInfo()} ${l}\n${l.stack}\n`);
  return;
 }

 // eslint-disable-next-line no-console
 logFile.write(`${getDebugInfo()}  ${l}\n`);
};
