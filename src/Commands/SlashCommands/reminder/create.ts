import type { Reminder as DBReminder } from '@prisma/client';
import { type Serialized } from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import { Reminder } from '../../../BaseClient/UtilModules/cache/bot/Reminder.js';
import { Decimal } from '@prisma/client/runtime/library.js';

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

 new Reminder({
  userId: cmd.user.id,
  channelId: cmd.channelId,
  endTime: new Decimal(endTime),
  reason: content,
 });

 cmd.client.util.replyCmd(cmd, {
  content: lan.created((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
 });
};

export const end = async (reminder: DBReminder | Serialized<DBReminder>) => {
 const user = await client.util.getUser(reminder.userId);

 client.util.DataBase.reminder.delete({ where: { startTime: reminder.startTime } }).then();

 if (!user) return;

 const language = await client.util.getLanguage(undefined);
 const lan = language.slashCommands.reminder;

 client.util.send(user, {
  content: lan.reminderEnded(reminder.userId),
  embeds: [{ description: reminder.reason, color: client.util.getColor() }],
 });
};
