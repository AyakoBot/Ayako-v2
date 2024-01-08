import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const reminder = await cmd.client.util.DataBase.reminders.delete({
  where: { uniquetimestamp: parseInt(id, 36) },
  select: { reason: true, endtime: true },
 });

 if (!reminder) {
  cmd.client.util.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

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
      value: cmd.client.util.constants.standard.getTime(Number(reminder.endtime)),
      inline: false,
     },
    ],
   },
  ],
 });
};
