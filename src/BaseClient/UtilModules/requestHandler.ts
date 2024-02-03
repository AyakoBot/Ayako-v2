import * as DiscordRest from '@discordjs/rest';
import * as DiscordCore from '@discordjs/core';
import cache from './cache.js';

/**
 * Sets up a new API instance for the given guild ID and token.
 * @param guildId - The ID of the guild to set up the API for.
 * @param token - The token to use for authentication.
 */
export default async (guildId: string, token: string) => {
 const rest = new DiscordRest.REST({ version: '10' }).setToken(token);
 const api = new DiscordCore.API(rest);
 cache.apis.set(guildId, api);
};
