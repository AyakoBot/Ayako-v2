import * as Discord from 'discord.js';

const isSnowflake = (id: string) => /^\d{17,19}$/.test(id);

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const reminders = await cmd.client.util.DataBase.reminders.findMany({
  where: { userid: cmd.user.id },
 });

 const embed: Discord.APIEmbed = {
  description: lan.desc((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
  fields: reminders.map((r) => ({
   name: `${isSnowflake(r.channelid) ? `<#${r.channelid}>` : language.t.Website} | ${cmd.client.util.constants.standard.getTime(
    Number(r.endtime),
   )} | ID: \`${Number(r.uniquetimestamp).toString(36)}\``,
   value: r.reason,
  })),
  color: cmd.client.util.getColor(
   cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
  ),
 };

 await cmd.client.util.replyCmd(cmd, { embeds: [embed] });
};
