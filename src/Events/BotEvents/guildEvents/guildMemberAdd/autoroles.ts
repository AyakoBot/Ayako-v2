import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 const settings = await member.client.util.DataBase.autoroles.findUnique({
  where: { guildid: member.guild.id, active: true },
 });
 if (!settings) return;

 let rolesToAdd: string[] = [];
 if (member.user.bot && settings.botroleid.length) {
  rolesToAdd = [...rolesToAdd, ...settings.botroleid];
 }
 if (!member.user.bot && settings.userroleid.length) {
  rolesToAdd = [...rolesToAdd, ...settings.userroleid];
 }
 if (settings.allroleid.length) rolesToAdd = [...rolesToAdd, ...settings.allroleid];
 if (!rolesToAdd.length) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 member.client.util.roleManager.add(member, rolesToAdd, language.autotypes.autoroles, 1);
};
