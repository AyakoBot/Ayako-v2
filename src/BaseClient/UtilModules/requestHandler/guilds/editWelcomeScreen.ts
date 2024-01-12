import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits the welcome screen of a guild.
 * @param guild - The guild to edit the welcome screen for.
 * @param body - The new welcome screen data.
 * @param reason - The reason for editing the welcome screen.
 * @returns A promise that resolves with the updated welcome screen,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildWelcomeScreenJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditWelcomeScreen(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot edit welcome screen`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .editWelcomeScreen(guild.id, body, { reason })
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has permission to edit the welcome screen of a guild.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to edit the welcome screen of a guild,
 * false otherwise.
 */
export const canEditWelcomeScreen = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
