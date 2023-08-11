import type * as Discord from 'discord.js';
import log from './log.js';
import cache from './cache.js';
import { create as installSlashCommands } from '../../../Commands/ButtonCommands/rp/toggle.js';

export default async (guild: Discord.Guild) => {
 log(guild);
 cache(guild);
 installSlashCommands(guild);
};
