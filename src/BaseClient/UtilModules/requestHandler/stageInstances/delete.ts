import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes a stage instance in a guild's voice channel.
 * @param guild - The guild where the stage instance is located.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @param reason - The reason for deleting the stage instance.
 * @returns A promise that resolves with the deleted stage instance,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, channelId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDelete(await guild.client.util.getBotMemberFromGuild(guild), channelId)) {
  const e = guild.client.util.requestHandlerError(`Cannot delete stage instance`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).stageInstances
  .delete(channelId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to delete stage instances.
 * @param me - The Discord guild member.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @returns A boolean indicating whether the guild member can delete stage instances.
 */
export const canDelete = (me: Discord.GuildMember, channelId: string) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);
