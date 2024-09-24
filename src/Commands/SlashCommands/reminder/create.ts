import Prisma from '@prisma/client';
import { type Serialized } from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const duration = cmd.client.util.getDuration(cmd.options.getString('duration', true));
 const content = cmd.options.getString('content', true);
 const now = Date.now();
 const endTime = now + duration;
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
   uniquetimestamp: now,
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
  Jobs.scheduleJob(getPathFromError(new Error(String(now))), new Date(endTime), () => {
   end(reminder);
  }),
  cmd.user.id,
  endTime,
 );

 cmd.client.util.replyCmd(cmd, {
  content: lan.created((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
 });
};

export enum EndReminderChannelType {
 User = 'user',
 Channel = 'channel',
}

export const endReminder = async (
 reminder: Prisma.reminders | Serialized<Prisma.reminders>,
 type: EndReminderChannelType,
) => {
 const channel = await (type === EndReminderChannelType.Channel
  ? client.util.getChannel.guildTextChannel(reminder.channelid)
  : client.util.getUser(reminder.userid));

 client.util.DataBase.reminders
  .delete({
   where: { uniquetimestamp: reminder.uniquetimestamp },
  })
  .then();

 client.util.cache.reminders.delete(reminder.userid, Number(reminder.endtime));

 if (!channel) return;

 const language = await client.util.getLanguage('guildId' in channel ? channel.guildId : undefined);
 const lan = language.slashCommands.reminder;

 client.util.send(channel as Discord.TextBasedChannel, {
  content: lan.reminderEnded(reminder.userid),
  embeds: [
   {
    description: reminder.reason,
    color: client.util.getColor(
     'guild' in channel ? await client.util.getBotMemberFromGuild(channel.guild) : undefined,
    ),
   },
  ],
 });
};

export const end = async (reminder: Prisma.reminders) => {
 const clusterWithChannel = (
  await client.cluster?.broadcastEval(
   (cl, { channelid }) => {
    if (cl.channels?.cache.get(channelid)) return cl.cluster?.id;
    return undefined;
   },
   { context: { channelid: reminder.channelid } },
  )
 )?.find((id): id is number => typeof id === 'number');

 if (!clusterWithChannel) {
  endReminder(reminder, EndReminderChannelType.User);
  return;
 }

 await client.cluster?.broadcastEval(
  (cl: typeof client, r: Serialized<Prisma.reminders>) => {
   const create = cl.util.files['/Commands/SlashCommands/reminder/create.js'];
   create.endReminder(r, create.EndReminderChannelType.Channel);
  },
  {
   context: reminder,
   cluster: clusterWithChannel,
  },
 );
};
