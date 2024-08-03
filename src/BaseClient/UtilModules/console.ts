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
 }/logs/console_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.log`,
 { flags: 'a' },
);
const { stdout } = process;

const stringify = (d: unknown) => {
 if (typeof d === 'string') return d;

 try {
  return JSON.stringify(d, null, 2);
 } catch {
  return JSON.stringify(d, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2);
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
