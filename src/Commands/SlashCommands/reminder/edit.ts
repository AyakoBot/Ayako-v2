import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const content = cmd.options.getString('content', true);
 const reminder = await ch.DataBase.reminders.update({
  where: { uniquetimestamp: parseInt(id, 36) },
  data: { reason: content },
 });

 if (!reminder) {
  ch.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

 ch.replyCmd(cmd, {
  content: lan.edited,
 });
};
