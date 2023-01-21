/* eslint-disable no-console */
// eslint-disable-next-line
import io from 'socket.io-client';
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

  socket.on('TOP_GG', async (voteData: CT.TopGGBotVote | CT.TopGGGuildVote) => {
    const tokenRow = await client.ch
      .query(`SELECT guildid FROM votetokens WHERE token = $1;`, [voteData.authorization])
      .then((r: DBT.votetokens[] | null) => (r ? r[0] : null));
    if (!tokenRow) return;

    const guild = client.guilds.cache.get(tokenRow.guildid);
    if (!guild) return;

    if (!('bot' in voteData)) voteData.guildID = String(voteData.guild);
    voteData.guild = guild;

    // TODO
    client.emit('voteCreate', voteData);
  });
};
