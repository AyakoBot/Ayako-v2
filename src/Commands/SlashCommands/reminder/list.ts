import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.reminder;
 const reminders = await cmd.client.util.DataBase.reminders.findMany({
  where: { userid: cmd.user.id },
 });

 const embed: Discord.APIEmbed = {
  description: lan.desc((await cmd.client.util.getCustomCommand(cmd.guild, 'reminder'))?.id ?? '0'),
  fields: reminders.map((r) => ({
   name: `<#${r.channelid}> | ${cmd.client.util.constants.standard.getTime(
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
