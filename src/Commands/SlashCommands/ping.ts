import type * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const stats = await cmd.client.util.DataBase.stats.findFirst();
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.ping;

 const sent = await cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    description: `**${lan.lastHeartbeat}**: ${cmd.client.util.util.makeInlineCode(
     String(stats?.heartbeat ?? 0),
    )} ${language.time.milliseconds}\n**${lan.websocket}**: ${cmd.client.util.util.makeInlineCode(
     String(cmd.client.ws.shards.get(Number(cmd.client.shard?.ids[0]))?.ping ?? 0),
    )} ${language.time.milliseconds}`,
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
    description: `**${lan.lastHeartbeat}**: ${cmd.client.util.util.makeInlineCode(
     String(stats?.heartbeat ?? 0),
    )} ${language.time.milliseconds}\n**${lan.websocket}**: ${cmd.client.util.util.makeInlineCode(
     String(cmd.client.ws.shards.get(Number(cmd.client.shard?.ids[0]))?.ping ?? 0),
    )} ${language.time.milliseconds}\n**${lan.roundtrip}**: ${cmd.client.util.util.makeInlineCode(
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
