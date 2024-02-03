import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the auto moderation rules for a given guild.
 * @param guild - The guild to retrieve the auto moderation rules for.
 * @returns A promise that resolves with an array of parsed auto moderation rules.
 */
export default async (guild: Discord.Guild) => {
 if (
  !guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.getAutoModerationRule.file.canGetAutoModerationRule(
   await guild.client.util.getBotMemberFromGuild(guild),
  )
 ) {
  const e = guild.client.util.requestHandlerError(`Cannot get auto moderation rules`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
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
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
