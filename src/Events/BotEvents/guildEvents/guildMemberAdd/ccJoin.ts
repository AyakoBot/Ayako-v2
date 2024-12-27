import { GuildMember } from 'discord.js';
import requestHandler from '../../../../BaseClient/UtilModules/requestHandler.js';
import { doCommands } from '../../../../Commands/SlashCommands/settings/custom-client.js';

export default async (member: GuildMember) => {
 if (!member.user.bot) return;
 if (Number(member.joinedTimestamp) < Date.now() - 30000) return;

 const cc = await member.client.util.DataBase.customclients.findUnique({
  where: { guildid: member.guild.id, appid: member.user.id, token: { not: null } },
 });
 if (!cc) return;
 if (!cc.token) return;

 const apiCreated = await requestHandler(member.guild.id, cc.token);
 if (!apiCreated) return;

 const me = await member.client.util.request.applications.getCurrent(member.guild);
 if ('message' in me) return;

 console.log('Custom Client Joined', member.guild.name, member.id, member.joinedTimestamp);

 const commands = await member.client.util.request.commands.getGuildCommands(member.guild);
 if (!('message' in commands) && !commands.length) doCommands(member.guild, me);
};
