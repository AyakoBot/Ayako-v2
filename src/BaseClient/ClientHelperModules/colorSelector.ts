import type * as Discord from 'discord.js';
import constants from '../Other/constants.js';

export default (member?: Discord.GuildMember) => {
  if (!member) return constants.colors.base;
  if (!member.roles.highest) return constants.colors.base;

  return member && member.roles.highest.color !== 0
    ? member.roles.highest.color
    : constants.colors.base;
};
