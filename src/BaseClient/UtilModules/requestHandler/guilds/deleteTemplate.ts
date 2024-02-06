import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes a guild template.
 * @param guild - The guild where the template is located.
 * @param templateCode - The code of the template to delete.
 * @returns A promise that resolves with the deleted template,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, templateCode: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteTemplate(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot delete template ${templateCode}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .deleteTemplate(guild.id, templateCode)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
export const canDeleteTemplate = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
