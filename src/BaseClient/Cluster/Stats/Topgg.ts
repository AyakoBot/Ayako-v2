import Manager from '../Manager.js';

const APITopGG = 'https://top.gg/api/bots/650691698409734151/stats';

export default (guilds: number) =>
 fetch(APITopGG, {
  method: 'post',
  headers: {
   Authorization: process.env.topGGToken ?? '',
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   server_count: guilds,
   shard_count: Manager.totalShards,
  }),
  // eslint-disable-next-line no-console
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));
