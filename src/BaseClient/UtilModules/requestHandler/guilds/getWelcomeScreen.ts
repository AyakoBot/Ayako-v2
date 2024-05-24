import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the welcome screen for a guild.
 * @param guild - The guild to retrieve the welcome screen for.
 * @returns A Promise that resolves with a new WelcomeScreen instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWelcomeScreen(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get welcome screen`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .getWelcomeScreen(guild.id)
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   if (e.code === 10069) return undefined;
   error(guild, e);
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
