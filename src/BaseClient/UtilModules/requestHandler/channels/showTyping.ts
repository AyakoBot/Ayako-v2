import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Shows typing indicator in the given guild text-based channel.
 * @param channel - The guild text-based channel to show typing indicator in.
 * @returns A promise that resolves when the typing indicator is successfully shown,
 * or rejects with an error.
 */
export default async (channel: Discord.GuildTextBasedChannel) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !channel.client.util.importCache.BaseClient.UtilModules.requestHandler.channels.getMessage.file.canGetMessage(
   channel,
   await channel.client.util.getBotMemberFromGuild(channel.guild),
  )
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot show typing indicator in ${channel.name} / ${channel.id}`,
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
  channel.client.util.cache.apis.get(channel.guild.id) ?? new DiscordCore.API(channel.client.rest)
 ).channels
  .showTyping(channel.id)
  .catch((e) => {
   channel.client.util.error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  });
};
