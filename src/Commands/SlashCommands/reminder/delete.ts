import * as Discord from 'discord.js';
import { Reminder } from '../../../BaseClient/UtilModules/cache/bot/Reminder.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const reminder = await cmd.client.util.DataBase.reminder.delete({
  where: { startTime: parseInt(id, 36) },
 });

 if (!reminder) {
  cmd.client.util.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

 new Reminder(reminder, false).delete();

 cmd.client.util.replyCmd(cmd, {
  content: lan.deleted,
  embeds: [
   {
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
    description: reminder.reason,
    fields: [
     {
      name: language.t.End,
      value: cmd.client.util.constants.standard.getTime(Number(reminder.endTime)),
      inline: false,
     },
    ],
   },
  ],
 });
};
