import type * as Discord from 'discord.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
 event.client.util.cache.scheduledEventUsers.add(user, event.guildId, event.id);

 if (!event.guild) return;

 log(event, user);
};
