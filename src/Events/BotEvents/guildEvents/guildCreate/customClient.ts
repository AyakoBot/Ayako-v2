import * as Discord from 'discord.js';
import { startupTasks } from '../../readyEvents/startupTasks/cache.js';

export default async (guild: Discord.Guild) => {
 startupTasks.awaitedJoinsCC([guild.id]);
};
