import client from '../../../BaseClient/Bot/Client.js';
import * as Typings from '../../../Typings/Typings.js';

import voteBotCreate, { endVote } from './voteBotCreate.js';
import voteGuildCreate from './voteGuildCreate.js';

export default async (vote: Typings.TopGGBotVote | Typings.TopGGGuildVote) => {
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

export const initReminders = async () => {
 const users = await client.util.DataBase.voters.findMany();
 users.forEach((user) => {
  const guild = client.guilds.cache.get(user.guildid);
  if (!guild) return;

  client.util.cache.votes.set(
   client.util.files.jobs.scheduleJob(
    new Date(Number(user.removetime) > Date.now() ? Number(user.removetime) : Date.now() + 10000),
    () => {
     const vote: Typings.TopGGGuildVote | Typings.TopGGBotVote = {
      user: user.userid,
      type: 'upvote',
      authorization: '',
      guild: user.voted,
      bot: user.voted,
     };

     if (user.votetype === 'bot') {
      delete (vote as { guild?: string }).guild;
      vote.authorization = '';
     }

     if (user.votetype === 'guild') delete (vote as { bot?: string }).bot;

     endVote(vote, guild);
    },
   ),
   user.voted,
   user.userid,
  );
 });
};
