import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Client.js';
import Socket from '../../../BaseClient/Socket.js';
import * as CT from '../../../Typings/Typings.js';
import { endVote } from '../../voteEvents/voteBotEvents/voteBotCreate.js';

export default async () => {
 initSocket();
 initReminders();
};

const initReminders = async () => {
 const users = await client.util.DataBase.voters.findMany();
 users.forEach((u) => {
  client.cluster?.broadcastEval(
   async (cl) => {
    const guild = cl.guilds.cache.get(u.guildid);
    if (!guild) return;

    cl.util.cache.votes.set(
     Jobs.scheduleJob(
      new Date(Number(u.removetime) > Date.now() ? Number(u.removetime) : Date.now() + 10000),
      () => {
       const vote: CT.TopGGGuildVote | CT.TopGGBotVote = {
        user: u.userid,
        type: 'upvote',
        authorization: '',
        guild: u.voted,
        bot: u.voted,
       };

       if (u.votetype === 'bot') {
        delete (vote as { guild?: string }).guild;
        vote.authorization = '';
       }

       if (u.votetype === 'guild') delete (vote as { bot?: string }).bot;

       endVote(vote, guild);
      },
     ),
     u.voted,
     u.userid,
    );
   },
   { context: u },
  );
 });
};

const initSocket = () =>
 Socket.on('topgg', async (v: CT.TopGGBotVote | CT.TopGGGuildVote) => {
  const rows = await client.util.DataBase.votesettings.findMany({
   where: {
    token: v.authorization,
   },
  });
  if (!rows.length) return;

  client.cluster?.broadcastEval(
   (cl, { vote, settings }) => {
    settings.forEach(async (s) => {
     const guild = cl.guilds.cache.get(s.guildid);
     if (!guild) return;

     const user = await cl.util.getUser(vote.user);
     if (!user) return;

     const member = await cl.util.request.guilds
      .getMember(guild, vote.user)
      .then((m) => ('message' in m ? undefined : m));

     if ('bot' in vote) {
      cl.util.files['/Events/voteEvents/voteBotEvents/voteBotCreate.js'](
       vote,
       guild,
       user,
       member,
       {
        ...s,
        uniquetimestamp: new cl.util.files.prisma.Decimal(s.uniquetimestamp),
        linkedid: s.linkedid ? new cl.util.files.prisma.Decimal(s.linkedid) : null,
       },
      );
     }

     if ('guild' in vote) {
      cl.util.files['/Events/voteEvents/voteGuildEvents/voteGuildCreate.js'](
       vote,
       guild,
       user,
       member,
       {
        ...s,
        uniquetimestamp: new cl.util.files.prisma.Decimal(s.uniquetimestamp),
        linkedid: s.linkedid ? new cl.util.files.prisma.Decimal(s.linkedid) : null,
       },
      );
     }
    });
   },
   { context: { settings: rows, vote: v } },
  );
 });
