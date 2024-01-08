import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const content = cmd.options.getString('content', true);
 const reminder = await cmd.client.util.DataBase.reminders.update({
  where: { uniquetimestamp: parseInt(id, 36) },
  data: { reason: content },
 });

 if (!reminder) {
  cmd.client.util.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: lan.edited,
 });
};
