import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const id = cmd.options.getString('id', true);
 const reminder = await ch.DataBase.reminders.delete({
  where: { uniquetimestamp: parseInt(id, 36) },
  select: { reason: true, endtime: true },
 });

 if (!reminder) {
  ch.errorCmd(cmd, lan.reminderNotExist, language);
  return;
 }

 ch.replyCmd(cmd, {
  content: lan.deleted,
  embeds: [
   {
    color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
    description: reminder.reason,
    fields: [
     {
      name: language.End,
      value: ch.constants.standard.getTime(Number(reminder.endtime)),
      inline: false,
     },
    ],
   },
  ],
 });
};
