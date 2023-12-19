import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Syncs a guild template with the given template code.
 * @param guild The guild to sync the template for.
 * @param templateCode The code of the template to sync.
 * @returns A promise that resolves with the synced guild template,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, templateCode: string) => {
 if (!canSyncTemplate(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot sync template in ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .syncTemplate(guild.id, templateCode)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to create a template.
 * @param me - The Discord guild member.
 * @returns A boolean indicating whether the guild member can create a template.
 */
export const canSyncTemplate = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
