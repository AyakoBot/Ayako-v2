import type * as Discord from 'discord.js';
import { create as installSlashCommands } from '../../../../Commands/ButtonCommands/rp/toggle.js';
import cache from './cache.js';
import thanks4Adding from './thanks4Adding.js';
import log from './log.js';
import ayakoRole from './ayakoRole.js';

export default async (guild: Discord.Guild) => {
 thanks4Adding(guild);
 log(guild);
 cache(guild);
 installSlashCommands(guild);
 ayakoRole(guild);
};
