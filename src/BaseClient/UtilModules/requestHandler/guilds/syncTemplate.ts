import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Syncs a guild template with the given template code.
 * @param guild The guild to sync the template for.
 * @param templateCode The code of the template to sync.
 * @returns A promise that resolves with the synced guild template,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, templateCode: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canSyncTemplate(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot sync template`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).guilds
  .syncTemplate(guild.id, templateCode)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
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
