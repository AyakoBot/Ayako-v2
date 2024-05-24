import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the webhooks for a given guild.
 * @param guild The guild to retrieve the webhooks for.
 * @returns A promise that resolves with an array of Webhook objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWebhooks(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get webhooks`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .getWebhooks(guild.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(guild.client, w)))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to get webhooks.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get webhooks, false otherwise.
 */
export const canGetWebhooks = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageWebhooks);
