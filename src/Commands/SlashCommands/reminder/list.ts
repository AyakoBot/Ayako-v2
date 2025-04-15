import * as Discord from 'discord.js';

const isSnowflake = (id: string) => /^\d{17,19}$/.test(id);

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const reminders = await cmd.client.util.DataBase.reminder.findMany({
  where: { userId: cmd.user.id },
 });

 const embed: Discord.APIEmbed = {
  fields: reminders.map((r) => ({
   name: `${isSnowflake(r.channelId) ? `<#${r.channelId}>` : language.t.Website} | ${cmd.client.util.constants.standard.getTime(
    Number(r.endTime),
   )} | ID: \`${Number(r.startTime).toString(36)}\``,
   value: r.reason,
  })),
  color: cmd.client.util.getColor(
   cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
  ),
 };

 await cmd.client.util.replyCmd(cmd, {
  content: lan.desc((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
  embeds: reminders.length ? [embed] : [],
 });
};
