import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Deletes an invite for the given guild and code.
 * @param guild - The guild where the invite is created.
 * @param code - The code of the invite to delete.
 * @param reason - The reason for deleting the invite.
 * @returns A promise that resolves with the deleted invite or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, code: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteInvite(await guild.client.util.getBotMemberFromGuild(guild), code)) {
  const e = guild.client.util.requestHandlerError(`Cannot delete invite ${code}`, [
   Discord.PermissionFlagsBits.ManageGuild,
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).invites
  .delete(code, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to delete an invite.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the necessary permissions, false otherwise.
 */
export const canDeleteInvite = (me: Discord.GuildMember, channelId: string) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild) ||
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageChannels);
