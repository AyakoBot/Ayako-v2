import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const reminders = await ch.DataBase.reminders.findMany({
  where: { userid: cmd.user.id },
 });

 const embed: Discord.APIEmbed = {
  description: lan.desc((await ch.getCustomCommand(cmd.guildId, 'reminder'))?.id ?? '0'),
  fields: reminders.map((r) => ({
   name: `<#${r.channelid}> | ${ch.constants.standard.getTime(
    Number(r.uniquetimestamp),
   )} | ID: \`${Number(r.endtime).toString(36)}\``,
   value: r.reason,
  })),
  color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
 };

 await ch.replyCmd(cmd, { embeds: [embed] });
};
