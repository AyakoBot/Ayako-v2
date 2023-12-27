import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (oldMember.premiumSinceTimestamp === member.premiumSinceTimestamp) return;
 if (!member.premiumSinceTimestamp) return;

 const settings = await ch.DataBase.nitrosettings.findUnique({
  where: {
   guildid: member.guild.id,
   active: true,
   notifchannels: { isEmpty: false },
   notification: true,
  },
 });
 if (!settings) return;

 const language = await ch.getLanguage(member.guild.id);
 const embedSettings = settings.notifembed
  ? await ch.DataBase.customembeds.findUnique({
     where: { guildid: member.guild.id, uniquetimestamp: settings.notifembed },
    })
  : undefined;

 const embed: Discord.APIEmbed =
  settings.notifembed && embedSettings
   ? ch.makeStp(ch.getDiscordEmbed(embedSettings), { member })
   : {
      author: { name: language.autotypes.nitro },
      color: ch.getColor(await ch.getBotMemberFromGuild(member.guild)),
      description: language.events.ready.nitro.started(member.user),
     };

 ch.send({ id: settings.notifchannels, guildId: member.guild.id }, { embeds: [embed] });
};
