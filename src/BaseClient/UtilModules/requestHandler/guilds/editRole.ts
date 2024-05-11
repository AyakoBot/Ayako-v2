import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a role in a guild.
 * @param guild The guild where the role is located.
 * @param roleId The ID of the role to edit.
 * @param body The new data for the role.
 * @param reason The reason for editing the role.
 * @returns A promise that resolves with the edited role or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 roleId: string,
 body: Discord.RESTPatchAPIGuildRoleJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditRole(await getBotMemberFromGuild(guild), roleId)) {
  const e = requestHandlerError(`Cannot edit role ${roleId}`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .editRole(
   guild.id,
   roleId,
   { ...body, icon: body.icon ? await Discord.resolveImage(body.icon) : body.icon },
   { reason },
  )
  .then((r) => new Classes.Role(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has permission to edit the specified role.
 * @param me - The guild member performing the action.
 * @param roleId - The role ID to be edited.
 * @returns True if the guild member can edit the role, false otherwise.
 */
export const canEditRole = (me: Discord.GuildMember, roleId: string) =>
 me.guild.ownerId === me.id ||
 (me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
  me.roles.highest.comparePositionTo(roleId) > 0);
