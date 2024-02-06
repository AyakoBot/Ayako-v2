import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the pinned messages in a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve pinned messages from.
 * @returns A promise that resolves with an array of parsed messages.
 */
export default async (channel: Discord.GuildTextBasedChannel) => {
 if (
  !channel.client.util.importCache.BaseClient.UtilModules.requestHandler.channels.getMessage.file.canGetMessage(
   channel,
   await channel.client.util.getBotMemberFromGuild(channel.guild),
  )
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot get pinned messages in ${channel.name} / ${channel.id}`,
   [
    Discord.PermissionFlagsBits.ViewChannel,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
     ? [Discord.PermissionFlagsBits.Connect]
     : []),
   ],
  );

  channel.client.util.error(channel.guild, e);
  return e;
 }

 return (
  channel.guild
   ? channel.client.util.cache.apis.get(channel.guild.id) ??
     new DiscordCore.API(channel.client.rest)
   : new DiscordCore.API(channel.client.rest)
 ).channels
  .getPins(channel.id)
  .then((msgs) => {
   const parsed = msgs.map((msg) => new Classes.Message(channel.client, msg));
   parsed.forEach((p) => {
    if (channel.messages.cache.get(p.id)) return;
    channel.messages.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
