import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the webhooks for a given guild.
 * @param guild The guild to retrieve the webhooks for.
 * @returns A promise that resolves with an array of Webhook objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWebhooks(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot get webhooks`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getWebhooks(guild.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(guild.client, w)))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
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
