import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves the stage instance associated with the given stage channel.
 * @param channel The stage channel to retrieve the stage instance for.
 * @returns A promise that resolves with the stage instance, or rejects with an error.
 */
export default async (channel: Discord.StageChannel) =>
 channel.guild.stageInstances.cache.find((s) => s.channelId === channel.id) ??
 (await getAPI(channel.guild)).stageInstances
  .get(channel.id)
  .then((s) => {
   const parsed = new Classes.StageInstance(channel.client, s, channel);
   if (channel.guild.stageInstances.cache.get(parsed.id)) return parsed;
   channel.guild.stageInstances.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, e);
   return e as Discord.DiscordAPIError;
  });
