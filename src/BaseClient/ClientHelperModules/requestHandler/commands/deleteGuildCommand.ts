import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import { guild as getBotIdFromGuild } from '../../getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Deletes a guild command from the Discord API and removes it from the guild's command cache.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .deleteGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
  .then(() => {
   if (cache.apis.get(guild.id)) {
    cache.commands.set(
     guild.id,
     cache.commands.get(guild.id)!.filter((c) => c.id !== commandId),
    );

    if (cache.commands.get(guild.id)!.length > 0) return;
    cache.commands.delete(guild.id);
    return;
   }

   guild.commands.cache.delete(commandId);
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
