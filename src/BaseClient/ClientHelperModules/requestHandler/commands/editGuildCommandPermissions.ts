import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Edits the permissions for a command in a guild.
 * @param guild The guild where the command is located.
 * @param userToken The token of the user making the request.
 * @param commandId The ID of the command to edit.
 * @param body The new permissions for the command.
 * @returns A promise that resolves with the updated command permissions
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 userToken: string,
 commandId: string,
 body: Discord.RESTPutAPIApplicationCommandPermissionsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .editGuildCommandPermissions(userToken, await getBotIdFromGuild(guild), guild.id, commandId, body)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
