import type DDeno from 'discordeno';
import constants from '../Other/Constants.json' assert { type: 'json' };
import client from '../DDenoClient';

export default async (member: DDeno.Member | undefined | null) => {
  if (!member) return constants.standard.color;

  const guild = await client.helpers.getGuild(member.guildId);
  const highestRole = member.roles
    .map((id) => guild.roles.get(id))
    .sort((a, b) => Number(b?.position) - Number(a?.position))
    .pop();

  if (!highestRole) return constants.standard.color;
  return member && highestRole.color !== 0 ? highestRole.color : constants.standard.color;
};
