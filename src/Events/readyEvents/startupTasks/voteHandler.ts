import io from 'socket.io-client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';
import type DBT from '../../../Typings/DataBaseTypings.js';
import auth from '../../../auth.json' assert { type: 'json' };

export default async () => {
  const socket = io('https://ayakobot.com', {
    transports: ['websocket'],
    auth: {
      reason: 'topgg',
      code: auth.socketToken,
    },
  });

  socket.on('topgg', async (vote: CT.TopGGBotVote | CT.TopGGGuildVote) => {
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
