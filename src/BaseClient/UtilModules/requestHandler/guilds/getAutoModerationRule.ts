import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves an auto moderation rule from the cache or API.
 * @param guild - The guild to retrieve the rule from.
 * @param ruleId - The ID of the rule to retrieve.
 * @returns A promise that resolves with the retrieved auto moderation rule.
 */
export default async (guild: Discord.Guild, ruleId: string) => {
 if (!canGetAutoModerationRule(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get auto moderation rule`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (
  guild.autoModerationRules.cache.get(ruleId) ??
  (await getAPI(guild)).guilds
   .getAutoModerationRule(guild.id, ruleId)
   .then((r) => {
    const parsed = new Classes.AutoModerationRule(guild.client, r, guild);
    if (guild.autoModerationRules.cache.get(parsed.id)) return parsed;
    guild.autoModerationRules.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   })
 );
};

/**
 * Checks if the given guild member has permission to view auto moderation rules.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to view auto moderation rules, false otherwise.
 */
export const canGetAutoModerationRule = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
