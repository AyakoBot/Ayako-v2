import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes the specified guild.
 * @param guild The guild to delete.
 * @returns A promise that resolves with the deleted guild ID if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDelete(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot delete guild ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds.delete(guild.id).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the specified guild member has the permission to delete the guild.
 * @param me - The Discord guild member.
 * @returns A boolean indicating whether the guild member can delete the guild.
 */
export const canDelete = (me: Discord.GuildMember) => me.guild.ownerId === me.id;
