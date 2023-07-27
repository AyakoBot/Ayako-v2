import type * as Discord from 'discord.js';
import { tasks } from '../../readyEvents/startupTasks/cache.js';

export default async (guild: Discord.Guild) => {
 Object.values(tasks).forEach((t) => t(guild));
};
