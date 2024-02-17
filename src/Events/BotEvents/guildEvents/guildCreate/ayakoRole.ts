import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (guild: Discord.Guild) => {
 const role = guild.roles.cache.find((r) => r.managed && r.tags?.botId === guild.client.user.id);
 if (!role) return;

 guild.client.util.request.guilds.editRole(guild, role.id, { color: CT.Colors.Base });
};
