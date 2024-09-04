import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Creates a new guild.
 * @param guild The guild to create the new guild in.
 * @param body The JSON body of the request.
 * @returns A promise that resolves with the newly created guild or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreate(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create guild ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .create(body)
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the given guild member can create a new guild.
 * @param me - The Discord guild member.
 * @returns True if the guild member can create a new guild, false otherwise.
 */
export const canCreate = (me: Discord.GuildMember) => me.client.guilds.cache.size < 10;
