import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Retrieves the widget settings for a given guild.
 * @param guild - The guild to retrieve the widget settings for.
 * @returns A promise that resolves to an object containing the widget
 * settings (enabled and channelId).
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWidgetSettings(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot get widget settings`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getWidgetSettings(guild.id)
  .then((w) => ({ enabled: w.enabled, channelId: w.channel_id }))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to get widget settings.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get widget settings, false otherwise.
 */
export const canGetWidgetSettings = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
