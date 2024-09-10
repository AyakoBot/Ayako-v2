import { GuildMember } from 'discord.js';
import { doCommands, getMe } from '../../../../Commands/SlashCommands/settings/custom-client.js';

export default async (member: GuildMember) => {
 if (!member.user.bot) return;

 const awaiting = await member.client.util.DataBase.awaitJoinCC.findUnique({
  where: {
   guildId: member.guild.id,
   botId: member.user.id,
  },
 });
 if (!awaiting) return;

 const me = await getMe(member.guild);
 if ('message' in me) {
  member.guild.client.util.DataBase.awaitJoinCC
   .delete({ where: { guildId: member.guild.id } })
   .then();
  return;
 }

 doCommands(member.guild, me);
};
