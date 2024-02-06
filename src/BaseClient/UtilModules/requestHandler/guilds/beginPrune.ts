import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Begins pruning of inactive members in a guild.
 * @param guild - The guild to prune members from.
 * @param body - The JSON body to send with the prune request.
 * @param reason - The reason for beginning the prune.
 * @returns A promise that resolves with the result of the prune request,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body?: Discord.RESTPostAPIGuildPruneJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canPrune(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot prune members`, [
   Discord.PermissionFlagsBits.KickMembers,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).guilds
  .beginPrune(guild.id, body, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the user has the necessary permissions to prune members from a guild.
 * @param me - The Discord guild member representing the user.
 * @returns A boolean indicating whether the user can prune members.
 */
export const canPrune = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.KickMembers);
