import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits the current guild member with the given data.
 * @param guild The guild where the member is located.
 * @param data The data to update the member with.
 * @returns A promise that resolves with the updated guild member
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, data: Discord.RESTPatchAPIGuildMemberJSONBody) =>
 (cache.apis.get(guild.id) ?? API).users
  .editCurrentGuildMember(guild.id, data)
  .then((m) => new Classes.GuildMember(guild.client, m, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
