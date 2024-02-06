import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the templates for a given guild.
 * @param guild - The guild to retrieve templates for.
 * @returns A promise that resolves with an array of GuildTemplate objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetTemplates(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot get template`, [
   Discord.PermissionFlagsBits.KickMembers,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getTemplates(guild.id)
  .then((templates) => templates.map((t) => new Classes.GuildTemplate(guild.client, t)))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
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
