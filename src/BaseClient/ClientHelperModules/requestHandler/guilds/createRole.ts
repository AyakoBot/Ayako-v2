import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

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
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createRole(
   guild.id,
   { ...body, icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon },
   { reason },
  )
  .then((r) => new Classes.Role(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
