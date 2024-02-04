import client from '../../../BaseClient/Bot/Client.js';
import type * as Socket from '../../../BaseClient/Cluster/Socket.js';

export default async ({ vote }: Socket.VoteMessage) => {
 const settings = await client.util.DataBase.votesettings.findMany({
  where: { token: vote.authorization },
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
   client.util.importCache.Events.ClusterEvents.voteEvents.voteBotCreate.file.default(
    vote,
    guild,
    user,
    member,
    {
     ...s,
     uniquetimestamp: new client.util.files.prisma.Decimal(s.uniquetimestamp),
     linkedid: s.linkedid ? new client.util.files.prisma.Decimal(s.linkedid) : null,
    },
   );
  }

  if ('guild' in vote) {
   client.util.importCache.Events.ClusterEvents.voteEvents.voteGuildCreate.file.default(
    vote,
    guild,
    user,
    member,
    {
     ...s,
     uniquetimestamp: new client.util.files.prisma.Decimal(s.uniquetimestamp),
     linkedid: s.linkedid ? new client.util.files.prisma.Decimal(s.linkedid) : null,
    },
   );
  }
 });
};
