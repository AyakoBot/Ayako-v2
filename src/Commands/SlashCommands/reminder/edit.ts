import * as Discord from 'discord.js';
import { Reminder } from '../../../BaseClient/UtilModules/cache/bot/Reminder.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const content = cmd.options.getString('content', true);
 const reminder = await cmd.client.util.DataBase.reminder.update({
  where: { startTime: parseInt(id, 36) },
  data: { reason: content },
 });

 if (!reminder) {
  cmd.client.util.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

 new Reminder(reminder);

 cmd.client.util.replyCmd(cmd, { content: lan.edited });
};
