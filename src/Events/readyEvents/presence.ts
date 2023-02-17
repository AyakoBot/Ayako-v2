import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';
import type DBT from '../../Typings/DataBaseTypings';

export default async () => {
  const random = Math.floor(Math.random() * 3);
  const users = await ch
    .query(`SELECT allusers FROM stats;`)
    .then((r: DBT.stats[] | null) => (r ? r[0].allusers : null));

  const activities: { name: string; type: number; url?: string }[] = [];

  switch (random) {
    case 1: {
      activities.push({
        name: `${client.guilds.cache.size} Servers | v1.6- | Default Prefix: ${ch.constants.standard.prefix}`,
        type: 5,
      });
      break;
    }
    case 2: {
      activities.push({
        name: `${users} Users | v1.6- | ${ch.constants.standard.prefix}invite`,
        type: 3,
      });
      break;
    }
    default: {
      activities.push({
        type: 1,
        url: 'https://www.twitch.tv/lars_und_so_',
        name: `Development | v1.6- | Default Prefix: ${ch.constants.standard.prefix}`,
      });
      break;
    }
  }
};
