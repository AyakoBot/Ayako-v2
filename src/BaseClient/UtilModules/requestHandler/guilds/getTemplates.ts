import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the templates for a given guild.
 * @param guild - The guild to retrieve templates for.
 * @returns A promise that resolves with an array of GuildTemplate objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetTemplates(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get template`, [Discord.PermissionFlagsBits.KickMembers]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .getTemplates(guild.id)
  .then((templates) => templates.map((t) => new Classes.GuildTemplate(guild.client, t)))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to get templates.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get templates, false otherwise.
 */
export const canGetTemplates = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
