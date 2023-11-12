import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a new emoji for the specified guild.
 * @param guild The guild to create the emoji in.
 * @param body The emoji data to create.
 * @param reason The reason for creating the emoji.
 * @returns A promise that resolves with the created GuildEmoji object,
 *  or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildEmojiJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createEmoji(
   guild.id,
   {
    ...body,
    image: (await Discord.DataResolver.resolveImage(body.image)) as string,
   },
   { reason },
  )
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
