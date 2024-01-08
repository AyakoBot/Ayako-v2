import * as Discord from 'discord.js';

export default async (cmd: Discord.ChannelSelectMenuInteraction) => {
 const channels = (
  await Promise.all(cmd.channels.map((o) => cmd.client.util.getChannel.guildTextChannel(o.id)))
 ).filter((o): o is Discord.TextChannel => !!o);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.send;

 await cmd.client.util.send(channels, {
  embeds: [new Discord.EmbedBuilder(cmd.message.embeds[1].data).data],
 });

 cmd.reply({
  content: lan.sent,
  ephemeral: true,
 });
};
