import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves an auto moderation rule from the cache or API.
 * @param guild - The guild to retrieve the rule from.
 * @param ruleId - The ID of the rule to retrieve.
 * @returns A promise that resolves with the retrieved auto moderation rule.
 */
export default async (guild: Discord.Guild, ruleId: string) =>
 guild.autoModerationRules.cache.get(ruleId) ??
 (cache.apis.get(guild.id) ?? API).guilds
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
  });
