import type * as Socket from '../../../BaseClient/Cluster/Socket.js';
import client from '../../../BaseClient/Bot/Client.js';

import voteBotCreate from './voteBotCreate.js';
import voteGuildCreate from './voteGuildCreate.js';

export default async ({ vote }: Socket.VoteMessage) => {
 const settings = await client.util.DataBase.votesettings.findMany({
  where: { token: vote.authorization, active: true },
 });
 if (!settings.length) return;

 settings.forEach(async (s) => {
  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  const user = await client.util.getUser(vote.user);
  if (!user) return;

  const member = await client.util.request.guilds
   .getMember(guild, vote.user)
   .then((m) => ('message' in m ? undefined : m));

  if ('bot' in vote) {
   voteBotCreate(vote, guild, user, member, {
    ...s,
    uniquetimestamp: new client.util.files.prisma.Decimal(s.uniquetimestamp),
    linkedid: s.linkedid ? new client.util.files.prisma.Decimal(s.linkedid) : null,
   });
  }

  if ('guild' in vote) {
   voteGuildCreate(vote, guild, user, member, {
    ...s,
    uniquetimestamp: new client.util.files.prisma.Decimal(s.uniquetimestamp),
    linkedid: s.linkedid ? new client.util.files.prisma.Decimal(s.linkedid) : null,
   });
  }
 });
};
