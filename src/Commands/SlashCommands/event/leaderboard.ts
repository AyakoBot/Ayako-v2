import type { APIEmbed, ChatInputCommandInteraction } from 'discord.js';

export default async (cmd: ChatInputCommandInteraction) => {
 const identId = cmd.inGuild() ? cmd.guildId : cmd.channelId;

 const all = await cmd.client.util.DataBase.event.findMany({
  where: { identId },
  orderBy: { hits: 'desc' },
  take: 30,
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId ?? 'en-GB');
 const lan = language.slashCommands.event;

 const embed: APIEmbed = {
  author: { name: lan.author },
  description: [{ hits: 0, userId: '0' }, ...all]
   .map((s, i) =>
    i !== 0 ? `\`${cmd.client.util.spaces(String(s.hits), 4)} |\` <@${s.userId}>` : '`Hits |` User',
   )
   .join('\n'),
  color: cmd.client.util.Colors.Ephemeral,
 };

 cmd.reply({ embeds: [embed], ephemeral: true });
};
