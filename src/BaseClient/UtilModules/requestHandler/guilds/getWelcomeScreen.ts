import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

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

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .getWelcomeScreen(guild.id)
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e: Discord.DiscordAPIError) => {
   if (e.code === 10069) return undefined;
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
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
