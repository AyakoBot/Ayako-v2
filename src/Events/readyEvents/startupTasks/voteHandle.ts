/* eslint-disable no-console */
// eslint-disable-next-line
import io from 'socket.io-client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import auth from '../../../auth.json' assert { type: 'json' };

export default async () => {
  const socket = io('https://ayakobot.com', {
    transports: ['websocket'],
    auth: {
      reason: 'top_gg_votes',
      code: auth.socketToken,
    },
  });

  socket.on('TOP_GG', async (vote: CT.TopGGBotVote | CT.TopGGGuildVote) => {
    const row = await ch
      .query(`SELECT guildid FROM votesettings WHERE token = $1;`, [vote.authorization])
      .then((r: DBT.votesettings[] | null) => (r ? r[0] : null));
    if (!row) return;

    const guild = client.guilds.cache.get(row.guildid);
    if (!guild) return;

    const user = await ch.getUser(vote.user).catch(() => undefined);
    if (!user) return;

    const member = await guild.members.fetch(vote.user).catch(() => undefined);

    if ('bot' in vote) client.emit('voteBotCreate', vote, guild, user, member);
    if ('guild' in vote) client.emit('voteGuildCreate', vote, guild, user, member);
  });
};
