import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';
import log from './log.js';

export default async (oldUser: Discord.User, user: Discord.User) => {
 const guilds = client.guilds.cache.filter((g) => g.members.cache.has(user.id));
 if (!guilds.size) return;

 guilds.forEach((g) => log(oldUser, user, g));
};
