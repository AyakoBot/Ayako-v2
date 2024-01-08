import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a guild template.
 * @param guild The guild where the template is located.
 * @param templateCode The code of the template to edit.
 * @param body The new data for the template.
 * @returns A promise that resolves with the edited guild template
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 templateCode: string,
 body: Discord.RESTPatchAPIGuildTemplateJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditTemplate(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot edit template ${templateCode}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .editTemplate(guild.id, templateCode, body)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has permission to edit templates.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to edit templates, false otherwise.
 */
export const canEditTemplate = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
