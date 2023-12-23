import * as Jobs from 'node-schedule';
import { Prisma } from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';
import client from '../../../BaseClient/Client.js';
import VoteBotCreate, { endVote } from '../../voteEvents/voteBotEvents/voteBotCreate.js';
import VoteGuildCreate from '../../voteEvents/voteGuildEvents/voteGuildCreate.js';
import Socket from '../../../BaseClient/Socket.js';

export default async () => {
 initSocket();
 initReminders();
};

const initReminders = async () => {
 const users = await ch.DataBase.voters.findMany();
 users.forEach((u) => {
  client.shard?.broadcastEval(
   async (cl) => {
    const guild = cl.guilds.cache.get(u.guildid);
    if (!guild) return;

    ch.cache.votes.set(
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
  const rows = await ch.DataBase.votesettings.findMany({
   where: {
    token: v.authorization,
   },
  });
  if (!rows.length) return;

  client.shard?.broadcastEval(
   (cl, { vote, settings }) => {
    settings.forEach(async (s) => {
     const guild = cl.guilds.cache.get(s.guildid);
     if (!guild) return;

     const user = await ch.getUser(vote.user);
     if (!user) return;

     const member = await ch.request.guilds
      .getMember(guild, vote.user)
      .then((m) => ('message' in m ? undefined : m));

     if ('bot' in vote) {
      const voteBotCreate: typeof VoteBotCreate = await import(
       `${process.cwd()}/Events/voteEvents/voteBotEvents/voteBotCreate.js`
      );

      voteBotCreate(vote, guild, user, member, {
       ...s,
       uniquetimestamp: new Prisma.Decimal(s.uniquetimestamp),
       linkedid: s.linkedid ? new Prisma.Decimal(s.linkedid) : null,
      });
     }

     if ('guild' in vote) {
      const voteGuildCreate: typeof VoteGuildCreate = await import(
       `${process.cwd()}/Events/voteEvents/voteGuildEvents/voteGuildCreate.js`
      );

      voteGuildCreate(vote, guild, user, member, {
       ...s,
       uniquetimestamp: new Prisma.Decimal(s.uniquetimestamp),
       linkedid: s.linkedid ? new Prisma.Decimal(s.linkedid) : null,
      });
     }
    });
   },
   { context: { settings: rows, vote: v } },
  );
 });
