import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldGuild: Discord.Guild, guild: Discord.Guild) => {
 log(oldGuild, guild);
};
