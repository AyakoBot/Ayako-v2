import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Edits the MFA level of a guild.
 * @param guild The guild to edit the MFA level of.
 * @param level The new MFA level to set.
 * @param reason The reason for editing the MFA level.
 * @returns A promise that resolves with the edited guild if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, level: Discord.GuildMFALevel, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditMFALevel(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot edit MFA level`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .editMFALevel(guild.id, level, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the specified guild member has permission to edit the MFA level of the guild.
 * @param me - The guild member to check.
 * @returns A boolean indicating whether the guild member can edit the MFA level.
 */
export const canEditMFALevel = (me: Discord.GuildMember) => me.guild.ownerId === me.id;
