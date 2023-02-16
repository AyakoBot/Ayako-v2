import type * as Discord from 'discord.js';
import log from './log.js';

export default async (member: Discord.GuildMember) => {
  log(member);
};
