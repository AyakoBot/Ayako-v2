import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes an auto-moderation rule from a guild.
 * @param guild - The guild to delete the auto-moderation rule from.
 * @param ruleId - The ID of the auto-moderation rule to delete.
 * @param reason - The reason for deleting the auto-moderation rule.
 * @returns A promise that resolves with the deleted auto-moderation rule,
 * or rejects with an error.
 */
export default async (guild: Discord.Guild, ruleId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteAutoModerationRule(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot delete auto-moderation rule ${ruleId}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .deleteAutoModerationRule(guild.id, ruleId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given Discord GuildMember has the permission to delete an auto-moderation rule.
 * @param me - The Discord GuildMember object representing the bot itself.
 * @returns A boolean indicating whether the GuildMember has the required permission.
 */
export const canDeleteAutoModerationRule = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
