import * as fs from 'fs';

export default {
 ratelimits: fs.createWriteStream(
  `${process.cwd()}/logs/ratelimits-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
  { flags: 'a' },
 ),
 console: fs.createWriteStream(
  `${process.cwd()}/logs/console_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
  { flags: 'a' },
 ),
};
