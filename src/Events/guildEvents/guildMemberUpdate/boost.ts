import * as Discord from 'discord.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (oldMember.premiumSinceTimestamp === member.premiumSinceTimestamp) return;
 if (!member.premiumSinceTimestamp) return;

 const settings = await member.client.util.DataBase.nitrosettings.findUnique({
  where: {
   guildid: member.guild.id,
   active: true,
   notifchannels: { isEmpty: false },
   notification: true,
  },
 });
 if (!settings) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 const embedSettings = settings.notifembed
  ? await member.client.util.DataBase.customembeds.findUnique({
     where: { guildid: member.guild.id, uniquetimestamp: settings.notifembed },
    })
  : undefined;

 const embed: Discord.APIEmbed =
  settings.notifembed && embedSettings
   ? member.client.util.makeStp(member.client.util.getDiscordEmbed(embedSettings), { member })
   : {
      author: { name: language.autotypes.nitro },
      color: member.client.util.getColor(
       await member.client.util.getBotMemberFromGuild(member.guild),
      ),
      description: language.events.ready.nitro.started(member.user),
     };

 member.client.util.send(
  { id: settings.notifchannels, guildId: member.guild.id },
  { embeds: [embed] },
 );
};
