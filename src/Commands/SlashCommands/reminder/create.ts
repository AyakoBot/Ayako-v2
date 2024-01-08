import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const duration = cmd.client.util.getDuration(cmd.options.getString('duration', true));
 const content = cmd.options.getString('content', true);
 const endTime = Date.now() + duration;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;

 if (duration < 10000) {
  cmd.client.util.errorCmd(cmd, lan.tooShort, language);
  return;
 }

 const reminder = await cmd.client.util.DataBase.reminders.create({
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

 cmd.client.util.cache.reminders.set(
  Jobs.scheduleJob(new Date(endTime), () => {
   endReminder(reminder);
  }),
  cmd.user.id,
  endTime,
 );

 cmd.client.util.replyCmd(cmd, {
  content: lan.created((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
 });
};

export const endReminder = (reminder: Prisma.reminders) => {
 client.shard?.broadcastEval(
  async (cl, { channelid, userid, uniquetimestamp, reason, endtime }) => {
   let channel: Discord.TextBasedChannel | Discord.User | undefined = cl.channels.cache.get(
    channelid,
   ) as Discord.TextBasedChannel | undefined;

   if (!channel || ('guild' in channel && !channel.guild.members.cache.get(userid))) {
    channel = await cl.util.getUser(userid);
   }

   cl.util.DataBase.reminders
    .delete({
     where: { uniquetimestamp },
    })
    .then();

   cl.util.cache.reminders.delete(userid, Number(endtime));

   if (!channel) return;

   const language = await cl.util.getLanguage('guildId' in channel ? channel.guildId : undefined);
   const lan = language.slashCommands.reminder;

   cl.util.send(channel as Discord.TextBasedChannel, {
    content: lan.reminderEnded(userid),
    allowed_mentions: {
     users: [userid],
    },
    embeds: [
     {
      description: reason,
      color: cl.util.getColor(
       'guild' in channel ? await cl.util.getBotMemberFromGuild(channel.guild) : undefined,
      ),
     },
    ],
   });
  },
  { context: reminder },
 );
};
