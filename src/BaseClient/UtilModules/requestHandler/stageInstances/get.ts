import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the stage instance associated with the given stage channel.
 * @param channel The stage channel to retrieve the stage instance for.
 * @returns A promise that resolves with the stage instance, or rejects with an error.
 */
export default async (channel: Discord.StageChannel) =>
 channel.guild.stageInstances.cache.find((s) => s.channelId === channel.id) ??
 (
  channel.client.util.cache.apis.get(channel.guild.id) ?? new DiscordCore.API(channel.client.rest)
 ).stageInstances
  .get(channel.id)
  .then((s) => {
   const parsed = new Classes.StageInstance(channel.client, s, channel);
   if (channel.guild.stageInstances.cache.get(parsed.id)) return parsed;
   channel.guild.stageInstances.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
