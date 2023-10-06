import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const duration = ch.getDuration(cmd.options.getString('duration', true));
 const content = cmd.options.getString('content', true);
 const endTime = Date.now() + duration;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;

 if (duration < 10000) {
  ch.errorCmd(cmd, lan.tooShort, language);
  return;
 }

 const reminder = await ch.DataBase.reminders.create({
  data: {
   channelid: cmd.channelId,
   endtime: endTime,
   uniquetimestamp: Date.now(),
   userid: cmd.user.id,
   reason: content,
  },
  select: {
   channelid: true,
   endtime: true,
   uniquetimestamp: true,
   userid: true,
   reason: true,
  },
 });

 ch.cache.reminders.set(
  Jobs.scheduleJob(new Date(endTime), () => {
   endReminder(reminder);
  }),
  cmd.user.id,
  endTime,
 );

 ch.replyCmd(cmd, {
  content: lan.created((await ch.getCustomCommand(cmd.guildId, 'reminder'))?.id ?? '0'),
 });
};

export const endReminder = (reminder: Prisma.reminders) => {
 client.shard?.broadcastEval(
  async (cl, { channelid, userid, uniquetimestamp, reason, endtime }) => {
   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
   let channel: Discord.TextBasedChannel | Discord.User | undefined = cl.channels.cache.get(
    channelid,
   ) as Discord.TextBasedChannel | undefined;

   if (!channel || ('guild' in channel && !channel.guild.members.cache.get(userid))) {
    channel = await chEval.getUser(userid);
   }

   chEval.DataBase.reminders
    .delete({
     where: { uniquetimestamp },
    })
    .then();

   chEval.cache.reminders.delete(userid, Number(endtime));

   if (!channel) return;

   const language = await chEval.getLanguage('guildId' in channel ? channel.guildId : undefined);
   const lan = language.slashCommands.reminder;

   chEval.send(channel as Discord.TextBasedChannel, {
    content: lan.reminderEnded(userid),
    allowed_mentions: {
     users: [userid],
    },
    embeds: [
     {
      description: reason,
      color: chEval.getColor(
       await chEval.getBotMemberFromGuild('guild' in channel ? channel.guild : undefined),
      ),
     },
    ],
   });
  },
  { context: reminder },
 );
};
