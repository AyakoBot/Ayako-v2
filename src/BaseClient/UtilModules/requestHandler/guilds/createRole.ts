import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Creates a new role in the specified guild.
 * @param guild - The guild where the role will be created.
 * @param body - The role data to be sent in the request body.
 * @param reason - The reason for creating the role.
 * @returns A promise that resolves with the created role or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildRoleJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateRole(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create role`, [Discord.PermissionFlagsBits.ManageRoles]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .createRole(
   guild.id,
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
 * Checks if the given guild member has the permission to create a role.
 * @param me - The Discord guild member.
 * @returns A boolean indicating whether the guild member can create a role.
 */
export const canCreateRole = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageRoles);
