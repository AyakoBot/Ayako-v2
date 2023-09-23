import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChannelSelectMenuInteraction) => {
 const channels = (
  await Promise.all(cmd.channels.map((o) => ch.getChannel.guildTextChannel(o.id)))
 ).filter((o): o is Discord.TextChannel => !!o);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.send;

 await ch.send(channels, {
  embeds: [new Discord.EmbedBuilder(cmd.message.embeds[0].data).data],
 });

 cmd.reply({
  content: lan.sent,
  ephemeral: true,
 });
};
