import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new channel in the specified guild.
 * @param guild The guild where the channel will be created.
 * @param body The channel data to be sent to the API.
 * @param reason The reason for creating the channel.
 * @returns A promise that resolves with the created channel or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateChannel(await getBotMemberFromGuild(guild), body)) {
  const e = requestHandlerError(`Cannot create channel`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .createChannel(guild.id, body, { reason })
  .then((c) => Classes.Channel(guild.client, c, guild))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions
 * to create a channel with the specified properties.
 * @param me - The Discord guild member object representing the bot.
 * @param body - The JSON body containing the properties of the channel to be created.
 * @returns A boolean indicating whether the guild member can create the channel.
 */
export const canCreateChannel = (
 me: Discord.GuildMember,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
) =>
 me.guild.ownerId === me.id ||
 (me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) &&
  (body.permission_overwrites
   ? body.permission_overwrites.every(
      (p) =>
       me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
       (p.id === me.id ? me.permissions.has(p.allow ? BigInt(p.allow) : 0n) : true),
     )
   : true));
