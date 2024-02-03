import * as Discord from 'discord.js';

/**
 * Retrieves the custom bot member from the given guild.
 * @param guild - The guild to retrieve the custom bot member from.
 * @returns A Promise that resolves with the custom bot member.
 */
export default async (guild: Discord.Guild) => {
 const botId = await guild.client.util.getBotIdFromGuild(guild);
 const rawMember = await guild.client.util.request.guilds.getMember(guild, botId);

 if ('message' in rawMember) {
  guild.client.util.error(guild, new Error(rawMember.message));
  return guild.client.util.request.guilds.getMember(
   undefined,
   guild.client.user.id,
   guild,
  ) as Promise<Discord.GuildMember>;
 }

 return rawMember;
};
