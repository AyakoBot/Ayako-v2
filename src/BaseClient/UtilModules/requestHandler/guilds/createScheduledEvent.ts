import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

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

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .createScheduledEvent(
   guild.id,
   {
    ...body,
    image: body.image ? await guild.client.util.util.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to create a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the "Manage Events" permission, false otherwise.
 */
export const canCreateScheduledEvent = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.CreateEvents) ||
 me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
