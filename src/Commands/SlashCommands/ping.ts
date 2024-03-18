import type * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const stats = await cmd.client.util.DataBase.heartbeats.findMany({ where: {} });
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.ping;

 const heartbeat = `**${lan.lastHeartbeat}**: ${cmd.client.util.makeTable([
  [language.t.Shard, language.time.milliseconds],
  ...stats.map((s) => [String(s.shard), `${s.ms}ms`]),
 ])}`;

 const sent = await cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    description: heartbeat,
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
    author: { name: lan.author },
   },
  ],
 });

 if (!sent) return;

 cmd.editReply({
  embeds: [
   {
    description: `${heartbeat}\n\n**${lan.roundtrip}**:\n${cmd.client.util.util.makeInlineCode(
     String(Math.abs(sent.createdTimestamp - Date.now())),
    )} ${language.time.milliseconds}`,
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
    author: { name: lan.author },
   },
  ],
 });
};
