import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a direct message channel between the bot and the specified user.
 * @param guild The guild where the DM will be created.
 * @param userId The ID of the user to create the DM with.
 * @returns A promise that resolves with the created DM channel,
 * or rejects with a DiscordAPIError if the DM creation fails.
 */
export default async <T extends Discord.Guild | undefined>(
 guild: T,
 userId: string,
 client: T extends Discord.Guild ? undefined : Discord.Client<true>,
) =>
 (guild
  ? guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
  : new DiscordCore.API(client!.rest)
 ).users
  .createDM(userId)
  .then((c) =>
   Classes.Channel<typeof guild extends Discord.Guild ? 0 : 1>(
    guild?.client ?? (client as Discord.Client<true>),
    c,
    guild as never,
   ),
  )
  .catch((e) => {
   if (!guild) return e as Discord.DiscordAPIError;

   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
