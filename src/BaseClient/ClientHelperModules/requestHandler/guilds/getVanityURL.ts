import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the vanity URL for a given guild and returns an invite object with the parsed data.
 * @param guild The guild to retrieve the vanity URL for.
 * @returns A Promise that resolves with the parsed invite object,
 * or rejects with a DiscordAPIError if the vanity URL is missing or inaccessible.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getVanityURL(guild.id)
  .then(async (v) => {
   const parsed = v.code
    ? new Classes.Invite(guild.client, {
       code: v.code,
       guild: {
        id: guild.id,
        name: guild.name,
        splash: guild.splash,
        banner: guild.banner,
        icon: guild.icon,
        vanity_url_code: v.code,
        description: guild.description,
        features: guild.features as Discord.APIGuild['features'],
        verification_level: guild.verificationLevel,
        nsfw_level: guild.nsfwLevel,
        premium_subscription_count: guild.premiumSubscriptionCount ?? undefined,
       },
       channel: guild.rulesChannel
        ? {
           id: guild.rulesChannel.id,
           name: guild.rulesChannel.name,
           type: guild.rulesChannel.type,
          }
        : null,
       inviter: await (cache.apis.get(guild.id) ?? API).users
        .get(guild.ownerId)
        .catch(() => undefined),
       approximate_presence_count: guild.approximatePresenceCount ?? undefined,
       approximate_member_count: guild.approximateMemberCount ?? undefined,
       uses: v.uses,
       max_uses: 0,
       max_age: 0,
       temporary: false,
       created_at: guild.createdAt.toISOString(),
      })
    : undefined;
   if (parsed) guild.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e) => {
   if (e.message !== 'Missing Access') {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }
   return e as Discord.DiscordAPIError;
  });
