import Manager from '../Manager.js';

const api = 'https://api.botlist.me/api/v1/bots/650691698409734151/stats';

export default (guilds: number) =>
 fetch(api, {
  method: 'post',
  headers: {
   Authorization: process.env.botListToken ?? '',
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   server_count: guilds,
   shard_count: Manager.totalShards,
  }),
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));
