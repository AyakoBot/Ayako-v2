import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';
import voteBotCreate from '../../voteEvents/voteBotEvents/voteBotCreate.js';
import voteGuildCreate from '../../voteEvents/voteGuildEvents/voteGuildCreate.js';
import Socket from '../../../BaseClient/Socket.js';

export default async () => {
 Socket.on('topgg', async (vote: CT.TopGGBotVote | CT.TopGGGuildVote) => {
  const rows = await ch.DataBase.votesettings.findMany({
   where: {
    token: vote.authorization,
   },
  });
  if (!rows.length) return;

  rows.forEach(async (row) => {
   const guild = client.guilds.cache.get(row.guildid);
   if (!guild) return;

   const user = await ch.getUser(vote.user).catch(() => undefined);
   if (!user) return;

   const member = await ch.request.guilds
    .getMember(guild, vote.user)
    .then((m) => ('message' in m ? undefined : m));

   if ('bot' in vote) voteBotCreate(vote, guild, user, member, row);
   if ('guild' in vote) voteGuildCreate(vote, guild, user, member, row);
  });
 });
};
