import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

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
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editRole(
   guild.id,
   roleId,
   { ...body, icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon },
   { reason },
  )
  .then((r) => new Classes.Role(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
