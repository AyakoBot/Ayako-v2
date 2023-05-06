// eslint-disable-next-line import/no-extraneous-dependencies
import { AutoPoster } from 'topgg-autoposter';
import fetch from 'node-fetch';
import Jobs from 'node-schedule';
import auth from '../../auth.json';
import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';
import type DBT from '../../Typings/DataBaseTypings';

const APIDiscordBotList = 'https://discordbotlist.com/api/v1/bots/650691698409734151/stats';
const APIDiscordBots = 'https://discord.bots.gg/api/v1/bots/650691698409734151/stats';

export default async () => {
 let allusers = await ch
  .query('SELECT allusers FROM stats;')
  .then((r: DBT.stats[] | null) => (r ? Number(r[0].allusers) : null));

 if (!allusers) {
  const userSize = await client.shard?.broadcastEval((c) =>
   c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
  );

  allusers = userSize?.reduce((acc, guildCount) => acc + guildCount, 0) ?? null;
 }

 Jobs.scheduleJob('0 0 */1 * * *', () => {
  fetch(APIDiscordBots, {
   method: 'post',
   body: JSON.stringify({
    guildCount: client.guilds.cache.size,
   }),
   headers: {
    'Content-Type': 'application/json',
    Authorization: auth.DBToken,
   },
  }).catch(() => null);

  fetch(APIDiscordBotList, {
   method: 'post',
   body: JSON.stringify({
    users: allusers,
    guilds: client.guilds.cache.size,
   }),
   headers: {
    'Content-Type': 'application/json',
    Authorization: auth.DBListToken,
   },
  }).catch(() => null);
 });

 AutoPoster(auth.topGGtoken, client);
};
