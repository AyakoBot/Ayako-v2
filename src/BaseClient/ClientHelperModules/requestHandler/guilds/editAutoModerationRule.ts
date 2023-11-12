import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits an auto-moderation rule for a guild.
 * @param guild The guild to edit the auto-moderation rule for.
 * @param ruleId The ID of the auto-moderation rule to edit.
 * @param body The new data for the auto-moderation rule.
 * @param reason The reason for editing the auto-moderation rule.
 * @returns A promise that resolves with the updated auto-moderation rule,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 ruleId: string,
 body: Discord.RESTPatchAPIAutoModerationRuleJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editAutoModerationRule(guild.id, ruleId, body, { reason })
  .then((r) => new Classes.AutoModerationRule(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
