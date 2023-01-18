import type * as Discord from 'discord.js';
import client from '../Client.js';

export default async (
  member: DDeno.Member | undefined | null,
  comparedMember: DDeno.Member | undefined | null,
) => {
  if (!member || !member.user) return false;
  if (!comparedMember || !comparedMember.user) return false;
  if (member.user.id === comparedMember.user.id) return false;
  const guild = await client.helpers.getGuild(member.guildId);
  if (!guild) return false;

  const memberHighestRole = member.roles
    .sort((a, b) => Number(guild.roles.get(a)?.position) - Number(guild.roles.get(b)?.position))
    .shift();
  const meHighestRole = comparedMember.roles
    .sort((a, b) => Number(guild.roles.get(a)?.position) - Number(guild.roles.get(b)?.position))
    .shift();

  if (!meHighestRole || !memberHighestRole) return false;
  if (
    Number(guild.roles.get(memberHighestRole)?.position) >=
    Number(guild.roles.get(meHighestRole)?.position)
  ) {
    return false;
  }
  return true;
};
