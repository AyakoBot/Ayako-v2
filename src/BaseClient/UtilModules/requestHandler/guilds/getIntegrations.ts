import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Returns a promise that resolves with an array of integrations for the given guild.
 * If an error occurs, logs the error and returns the error object.
 * @param guild - The guild to get integrations for.
 * @returns A promise that resolves with an array of integrations for the given guild.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetIntegrations(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot get integrations`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).guilds
  .getIntegrations(guild.id)
  .then((integrations) => integrations.map((i) => new Classes.Integration(guild.client, i, guild)))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the specified guild member has the permission to manage guild integrations.
 * @param me - The guild member to check.
 * @returns A promise that resolves to a boolean,
 * indicating whether the guild member can manage guild integrations.
 */
export const canGetIntegrations = async (me: Discord.GuildMember) =>
 me.permissions?.has(Discord.PermissionFlagsBits.ManageGuild);
