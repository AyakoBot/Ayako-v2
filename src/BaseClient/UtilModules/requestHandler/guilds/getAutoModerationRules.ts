import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import { canGetAutoModerationRule } from './getAutoModerationRule.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the auto moderation rules for a given guild.
 * @param guild - The guild to retrieve the auto moderation rules for.
 * @returns A promise that resolves with an array of parsed auto moderation rules.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetAutoModerationRule(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get auto moderation rules`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .getAutoModerationRules(guild.id)
  .then((rules) => {
   const parsed = rules.map((r) => new Classes.AutoModerationRule(guild.client, r, guild));
   parsed.forEach((p) => {
    if (guild.autoModerationRules.cache.get(p.id)) return;
    guild.autoModerationRules.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
