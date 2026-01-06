import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Creates a webhook for a given guild and channel with the provided data.
 * @param guild - The guild where the webhook will be created.
 * @param channelId - The ID of the channel where the webhook will be created.
 * @param body - The data to be sent in the request body.
 * @returns A promise that resolves with a new Webhook object if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (
 guild: Discord.Guild,
 channelId: string,
 body: Discord.RESTPostAPIChannelWebhookJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateWebhook(channelId, await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot create webhook`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).channels
  .createWebhook(channelId, {
   ...body,
   avatar: body.avatar ? await guild.client.util.util.resolveImage(body.avatar) : body.avatar,
  })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the user has the necessary permissions to create a webhook in a given channel.
 * @param channelId - The ID of the guild-based channel where the webhook will be created.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can create a webhook in the channel.
 */
export const canCreateWebhook = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageWebhooks) &&
 Number(me.client.util.cache.webhooks.cache.get(me.guild.id)?.get(channelId)?.size || 0) < 15;
