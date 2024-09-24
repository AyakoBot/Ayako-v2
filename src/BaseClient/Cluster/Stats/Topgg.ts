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
   shards: splitBetweenShards(guilds, Manager.totalShards).map((c) => c),
   shard_count: Manager.totalShards,
  }),
  // eslint-disable-next-line no-console
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));

const splitBetweenShards = (x: number, y: number): number[] =>
 Array(y)
  .fill(Math.floor(x / y))
  .map((res) => res + 1);
