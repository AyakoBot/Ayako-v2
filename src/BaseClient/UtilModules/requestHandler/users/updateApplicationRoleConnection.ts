import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Updates the application role connection for the given guild.
 * @param guild - The guild to update the application role connection for.
 * @param applicationId - The ID of the application to update the role connection for.
 * @param body - The JSON body containing the updated role connection information.
 * @returns A promise that resolves with the updated role connection information,
 * or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 applicationId: string,
 body: Discord.RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).users
  .updateApplicationRoleConnection(applicationId, body)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
