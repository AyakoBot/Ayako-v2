import type * as Discord from 'discord.js';
import constants from '../Other/Constants.js';

export default (member?: Discord.GuildMember) => {
  if (!member) return constants.standard.color;
  if (!member.roles.highest) return constants.standard.color;

  return member && member.roles.highest.color !== 0
    ? member.roles.highest.color
    : constants.standard.color;
};
