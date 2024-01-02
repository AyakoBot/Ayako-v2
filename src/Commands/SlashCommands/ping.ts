import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const stats = await ch.DataBase.stats.findFirst();
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.ping;

 const sent = await ch.replyCmd(cmd, {
  embeds: [
   {
    description: `**${lan.lastHeartbeat}**: ${ch.util.makeInlineCode(
     String(stats?.heartbeat ?? 0),
    )} ${language.time.milliseconds}\n**${lan.websocket}**: ${ch.util.makeInlineCode(
     String(cmd.client.ws.shards.get(Number(cmd.client.shard?.ids[0]))?.ping ?? 0),
    )} ${language.time.milliseconds}`,
    color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
    author: { name: lan.author },
   },
  ],
 });

 if (!sent) return;

 cmd.editReply({
  embeds: [
   {
    description: `**${lan.lastHeartbeat}**: ${ch.util.makeInlineCode(
     String(stats?.heartbeat ?? 0),
    )} ${language.time.milliseconds}\n**${lan.websocket}**: ${ch.util.makeInlineCode(
     String(cmd.client.ws.shards.get(Number(cmd.client.shard?.ids[0]))?.ping ?? 0),
    )} ${language.time.milliseconds}\n**${lan.roundtrip}**: ${ch.util.makeInlineCode(
     String(sent.createdTimestamp - cmd.createdTimestamp),
    )} ${language.time.milliseconds}`,
    color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
    author: { name: lan.author },
   },
  ],
 });
};
