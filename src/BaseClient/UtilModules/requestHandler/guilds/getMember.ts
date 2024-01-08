import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a member from a guild by their user ID.
 * @param guild The guild to retrieve the member from, undefined if no custom API should be used
 * @param userId The ID of the user to retrieve.
 * @param g The guild to retrieve the member from, in case no custom API should be used
 * @returns A Promise that resolves with the GuildMember object,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async <T extends Discord.Guild | undefined>(
 guild: T,
 userId: string,
 g?: T extends undefined ? Discord.Guild : undefined,
): Promise<Discord.GuildMember | Discord.DiscordAPIError> =>
 (guild ?? g)!.members.cache.get(userId) ??
 (guild ? cache.apis.get(guild.id) ?? API : API).guilds
  .getMember((guild ?? g)!.id, userId)
  .then((m) => {
   const parsed = new Classes.GuildMember((guild ?? g)!.client, m, (guild ?? g)!);
   if ((guild ?? g)!.members.cache.get(parsed.id)) return parsed;
   (guild ?? g)!.members.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => e as Discord.DiscordAPIError);
