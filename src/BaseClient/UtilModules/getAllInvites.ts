import * as Discord from 'discord.js';

/**
 * Retrieves all the invites for a given guild.
 * @param guild - The guild to retrieve invites for.
 * @returns A promise that resolves to an array of invites for the guild.
 */
export default async (guild: Discord.Guild) => {
 const { cache } = guild.invites;

 const me = await guild.client.util.getBotMemberFromGuild(guild);
 if (me.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) return cache.map((i) => i);

 await guild.client.util.request.guilds.getInvites(guild);
 if (!guild.vanityURLCode) return cache.map((i) => i);

 await guild.client.util.request.guilds.getVanityURL(guild);
 return cache.map((i) => i);
};
