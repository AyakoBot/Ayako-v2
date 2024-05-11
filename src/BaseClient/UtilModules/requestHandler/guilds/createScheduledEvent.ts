import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a scheduled event for a guild.
 * @param guild The guild to create the scheduled event for.
 * @param body The data for the scheduled event.
 * @param reason The reason for creating the scheduled event.
 * @returns A promise that resolves with the created scheduled event
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildScheduledEventJSONBody,
 reason?: string,
) => {
 if (!canCreateScheduledEvent(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create scheduled event`, [
   Discord.PermissionFlagsBits.ManageEvents,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .createScheduledEvent(
   guild.id,
   {
    ...body,
    image: body.image ? await Discord.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

// TODO: CreateEvents should be coming to D.js soon.
/**
 * Checks if the given guild member has the necessary permissions to create a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the "Manage Events" permission, false otherwise.
 */
export const canCreateScheduledEvent = (me: Discord.GuildMember) =>
 me.permissions.has(17592186044416n) ||
 me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
