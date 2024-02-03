import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates an auto-moderation rule for a guild.
 * @param guild The guild to create the rule for.
 * @param body The JSON body of the auto-moderation rule.
 * @param reason The reason for creating the rule.
 * @returns A promise that resolves with the created auto-moderation rule.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIAutoModerationRuleJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateAutoModerationRule(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot create auto-moderation rule`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .createAutoModerationRule(guild.id, body, { reason })
  .then((r) => new Classes.AutoModerationRule(guild.client, r, guild))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to create an auto-moderation rule.
 * @param me - The guild member.
 * @returns A boolean indicating whether the member can create an auto-moderation rule.
 */
export const canCreateAutoModerationRule = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
