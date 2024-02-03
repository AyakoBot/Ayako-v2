import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a scheduled event for a guild.
 * @param guild The guild where the scheduled event belongs.
 * @param eventId The ID of the scheduled event to edit.
 * @param body The new data for the scheduled event.
 * @param reason The reason for editing the scheduled event.
 * @returns A promise that resolves with the edited scheduled event,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 eventId: string,
 body: Discord.RESTPatchAPIGuildScheduledEventJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditScheduledEvent(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot edit scheduled event ${eventId}`, [
   Discord.PermissionFlagsBits.ManageEvents,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .editScheduledEvent(
   guild.id,
   eventId,
   {
    ...body,
    image: body.image ? await Discord.DataResolver.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to edit a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the "Manage Events" permission, false otherwise.
 */
export const canEditScheduledEvent = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
