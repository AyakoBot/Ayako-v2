import * as Discord from 'discord.js';

export default async (info: Discord.RateLimitData) => {
 if (!process.argv.includes('--debug')) return;
 const str = `${info.method} ${info.url.replace(
  'https://discord.com/api/v10/',
  '',
 )} ${info.timeToReset}ms`;

 // eslint-disable-next-line no-console
 console.log('[Ratelimited]', str);
};
