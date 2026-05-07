import { getInfo } from 'discord-hybrid-sharding';

const APIDF = 'https://discordforge.org/api/external/bots/commands';

export default (guilds: number, users: number) =>
 fetch(APIDF, {
  method: 'post',
  headers: {
   'x-api-key': process.env.discordforgeToken ?? '',
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   server_count: guilds,
   shard_count: getInfo().SHARD_LIST.length,
   user_count: users,
   voice_connections: 0,
  }),
  // eslint-disable-next-line no-console
 }).then(async (r) => (r.ok ? undefined : console.log(await r.text())));
