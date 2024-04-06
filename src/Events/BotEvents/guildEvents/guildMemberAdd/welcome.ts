import Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 if (member.pending) return;
 const settings = await member.client.util.DataBase.welcome.findUnique({
  where: { guildid: member.guild.id, active: true },
 });
 if (!settings) return;

 const channel = settings.channelid
  ? await member.client.util.getChannel.guildTextChannel(settings.channelid)
  : member.guild.systemChannel;
 if (!channel) return;

 const rawEmbed = settings.embed
  ? await member.client.util.DataBase.customembeds.findUnique({
     where: { uniquetimestamp: settings.embed },
    })
  : undefined;

 const embed: Discord.APIEmbed = rawEmbed
  ? member.client.util.makeStp(member.client.util.getDiscordEmbed(rawEmbed), {
     member,
     serverName: member.guild.name,
    })
  : await getDefaultEmbed(member);

 const content = `${settings.pingjoin ? member : ''}${
  settings.pingroles.length ? `\n${settings.pingroles.map((r) => `<@&${r}>`).join(' ')}` : ''
 }${settings.pingusers.length ? `\n${settings.pingusers.map((r) => `<@${r}>`).join(' ')}` : ''}`;

 member.client.util.send(channel, {
  embeds: [embed],
  content,
  allowed_mentions: { roles: settings.pingroles },
 });
};

const getDefaultEmbed = async (member: Discord.GuildMember) => {
 const language = await member.client.util.getLanguage(member.guild.id);

 return {
  description: member.client.util.stp(language.events.guildMemberAdd.welcome.embed, { member }),
 };
};
