import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the welcome screen for a guild.
 * @param guild - The guild to retrieve the welcome screen for.
 * @returns A Promise that resolves with a new WelcomeScreen instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWelcomeScreen(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot get welcome screen`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).guilds
  .getWelcomeScreen(guild.id)
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   if (e.code === 10069) return undefined;
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to get the welcome screen.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get the welcome screen, false otherwise.
 */
export const canGetWelcomeScreen = (me: Discord.GuildMember) =>
 me.guild.features.find((f) => f === Discord.GuildFeature.WelcomeScreenEnabled)
  ? true
  : me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
