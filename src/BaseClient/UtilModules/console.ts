import * as fs from 'fs';

export const getDebugInfo = () => {
 const dateObject = new Date();

 // Time in the Format: HH:MM:SS AM/PM
 const time = dateObject.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
 });
 // Unix Timestamp
 const timestamp = dateObject.getTime();

 return `[${time} ${timestamp}]`;
};

const file = fs.createWriteStream(
 `${process.cwd()}${
  process.cwd().includes('dist') ? '/..' : ''
 }/logs/console_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
 { flags: 'a' },
);
const { stdout } = process;

const stringify = (d: unknown) => {
 switch (typeof d) {
  case 'string':
  case 'number':
  case 'bigint':
  case 'boolean':
  case 'undefined':
   return d;
  default:
   return JSON.stringify(d, null, 2);
 }
};

// eslint-disable-next-line no-console
console.log = (...d) => {
 file.write(
  `${getDebugInfo()}\n${d
   .map((a) => stringify(a))
   .join(' ')
   .replace('\n', '\n\r')}\n`,
 );
 stdout.write(
  `${d
   .map((a) => stringify(a))
   .join(' ')
   .replace('\n', '\n\r')}\n`,
 );
};

export default {};
