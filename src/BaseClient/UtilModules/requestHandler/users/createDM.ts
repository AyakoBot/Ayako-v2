import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Creates a direct message channel between the bot and the specified user.
 * @param guild The guild where the DM will be created.
 * @param userId The ID of the user to create the DM with.
 * @param client - The client to use if guild is not defined.
 * @returns A promise that resolves with the created DM channel,
 * or rejects with a DiscordAPIError if the DM creation fails.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 client: Discord.Client<true>,
): Promise<Discord.DMChannel | Discord.DiscordAPIError>;
function fn(
 guild: Discord.Guild,
 userId: string,
 client?: undefined,
): Promise<Discord.DMChannel | Discord.DiscordAPIError>;
async function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 client?: Discord.Client<true>,
): Promise<Discord.DMChannel | Discord.DiscordAPIError> {
 const c = (guild?.client ?? client)!;

 return ((guild ? cache.apis.get(guild.id) : undefined) ?? API).users
  .createDM(userId)
  .then((dm) => Classes.Channel<typeof guild extends Discord.Guild ? 0 : 1>(c, dm, guild as never))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
}

export default fn;
