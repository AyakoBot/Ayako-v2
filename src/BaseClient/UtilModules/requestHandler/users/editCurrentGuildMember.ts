import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Edits the current guild member with the given data.
 * @param guild The guild where the member is located.
 * @param data The data to update the member with.
 * @param saveGuild - The guild to use if guild is not defined.
 * @returns A promise that resolves with the updated guild member
 * or rejects with a DiscordAPIError.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 data: Discord.RESTPatchAPIGuildMemberJSONBody,
 saveGuild: Discord.Guild,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error>;
function fn(
 guild: Discord.Guild,
 data: Discord.RESTPatchAPIGuildMemberJSONBody,
 saveGuild?: undefined,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error>;
async function fn(
 guild: undefined | null | Discord.Guild,
 data: Discord.RESTPatchAPIGuildMemberJSONBody,
 saveGuild?: Discord.Guild,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error> {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const g = (guild ?? saveGuild)!;

 return (await getAPI(guild)).users
  .editCurrentGuildMember(g.id, data)
  .then((m) => new Classes.GuildMember(g.client, m, g))
  .catch((e: Discord.DiscordAPIError) => {
   error(g, e as Discord.DiscordAPIError);
   return e;
  });
}

export default fn;
