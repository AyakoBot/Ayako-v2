import Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 if (member.pending) return;
 const settings = await ch.DataBase.welcome.findUnique({
  where: { guildid: member.guild.id, active: true },
 });
 if (!settings) return;

 const channel = settings.channelid
  ? await ch.getChannel.guildTextChannel(settings.channelid)
  : member.guild.systemChannel;
 if (!channel) return;

 const rawEmbed = settings.embed
  ? await ch.DataBase.customembeds.findUnique({ where: { uniquetimestamp: settings.embed } })
  : undefined;

 const embed: Discord.APIEmbed = rawEmbed
  ? ch.makeStp(ch.getDiscordEmbed(rawEmbed), { member })
  : await getDefaultEmbed(member);

 const content = `${settings.pingjoin ? member : ''}${
  settings.pingroles.length ? `\n${settings.pingroles.map((r) => `<@&${r}>`).join(' ')}` : ''
 }${settings.pingusers.length ? `\n${settings.pingusers.map((r) => `<@${r}>`).join(' ')}` : ''}`;

 ch.send(channel, {
  embeds: [embed],
  content,
  allowed_mentions: {
   users: [...settings.pingusers, settings.pingjoin ? member.id : undefined].filter(
    (r): r is string => !!r,
   ),
   roles: settings.pingroles,
  },
 });
};

const getDefaultEmbed = async (member: Discord.GuildMember) => {
 const language = await ch.getLanguage(member.guild.id);

 return { description: ch.stp(language.events.guildMemberAdd.welcome.embed, { member }) };
};
