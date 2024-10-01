import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

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

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 const me = await guild.client.util.getBotMemberFromGuild(guild);

 return (await getAPI(guild)).guilds
  .getWebhooks(guild.id)
  .then((raw) => {
   const webhooks = raw.map((w) => new Classes.Webhook(guild.client, w));

   webhooks
    .filter((w) => w.owner?.id === me.id)
    .forEach((w) => guild.client.util.cache.webhooks.set(w));

   return webhooks;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
/**
 * Checks if the given guild member has the permission to get webhooks.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get webhooks, false otherwise.
 */
export const canGetWebhooks = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageWebhooks);
