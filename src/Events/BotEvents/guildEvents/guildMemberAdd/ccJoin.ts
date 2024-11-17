import { GuildMember } from 'discord.js';
import requestHandler from '../../../../BaseClient/UtilModules/requestHandler.js';
import { doCommands, getMe } from '../../../../Commands/SlashCommands/settings/custom-client.js';

export default async (member: GuildMember) => {
 if (!member.user.bot) return;

 const cc = await member.client.util.DataBase.customclients.findUnique({
  where: { guildid: member.guild.id, appid: member.user.id, token: { not: null } },
 });
 if (!cc) return;
 if (!cc.token) return;

 const apiCreated = await requestHandler(member.guild.id, cc.token);
 if (!apiCreated) return;

 const me = await getMe(member.guild);
 if ('message' in me) return;

 doCommands(member.guild, me);
};
