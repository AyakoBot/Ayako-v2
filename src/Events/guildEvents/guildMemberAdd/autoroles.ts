import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 const settings = await ch.DataBase.autoroles.findUnique({
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

 const language = await ch.getLanguage(member.guild.id);
 ch.roleManager.add(member, rolesToAdd, language.autotypes.autoroles, 1);
};
