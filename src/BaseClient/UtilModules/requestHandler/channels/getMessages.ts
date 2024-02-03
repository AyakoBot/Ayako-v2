import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves messages from a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve messages from.
 * @param query - The query parameters to include in the request.
 * @returns A promise that resolves with an array of parsed messages.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 query?: Discord.RESTGetAPIChannelMessagesQuery,
) => {
 if (
  !channel.client.util.importCache.BaseClient.UtilModules.requestHandler.channels.getMessage.file.canGetMessage(
   channel,
   await channel.client.util.getBotMemberFromGuild(channel.guild),
  )
 ) {
  const e = channel.client.util.requestHandlerError(
   `Cannot get messages in ${channel.name} / ${channel.id}`,
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

 return (channel.guild ? channel.client.util.cache.apis.get(channel.guild.id) ?? API : API).channels
  .getMessages(channel.id, query)
  .then((msgs) => {
   const parsed = msgs.map((m) => new Classes.Message(channel.client, m));
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
