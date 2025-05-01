import { Decimal } from '@prisma/client/runtime/library.js';
import * as Discord from 'discord.js';
import { Reminder } from '../../../BaseClient/UtilModules/cache/bot/Reminder.js';

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
