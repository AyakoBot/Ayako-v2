import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves a user from the cache or from the API if not found in cache.
 * @param guild - The guild where the user is located.
 * @param userId - The ID of the user to retrieve.
 * @param client - The client to use if guild is not defined.
 * @returns A Promise that resolves to the user object.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 client: Discord.Client<true>,
 options?: { force: true },
): Promise<Classes.User | Discord.DiscordAPIError>;
function fn(
 guild: Discord.Guild,
 userId: string,
 client?: undefined,
 options?: { force: true },
): Promise<Classes.User | Discord.DiscordAPIError>;
async function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 client?: Discord.Client<true>,
 options?: { force: true },
): Promise<Classes.User | Discord.DiscordAPIError> {
 const c = (guild?.client ?? client)!;

 return (
  (!options?.force ? c!.users.cache.get(userId) : undefined) ??
  (await getAPI(guild)).users
   .get(userId)
   .then((u) => {
    const parsed = new Classes.User(c, u);
    if (c.users.cache.get(parsed.id)) return parsed;

    c.users.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e: Discord.DiscordAPIError) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e;
   })
 );
}

export default fn;
