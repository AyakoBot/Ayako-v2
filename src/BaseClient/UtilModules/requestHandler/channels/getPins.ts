import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';
import { canGetMessage } from './getMessage.js';

/**
 * Retrieves the pinned messages in a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve pinned messages from.
 * @returns A promise that resolves with an array of parsed messages.
 */
export default async (
 channel:
  | Discord.GuildTextBasedChannel
  | {
     id: string;
     name: string;
     guild: Discord.Guild;
     type: Discord.ChannelType;
     skip: true;
     client: Discord.Client<true>;
    },
) => {
 if (
  'skip' in channel && channel.skip
   ? false
   : !canGetMessage(
      channel as Discord.GuildTextBasedChannel,
      await getBotMemberFromGuild(channel.guild),
     )
 ) {
  const e = requestHandlerError(`Cannot get pinned messages in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ViewChannel,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
    ? [Discord.PermissionFlagsBits.Connect]
    : []),
  ]);

  error(channel.guild, e);
  return e;
 }

 return (await getAPI(channel.guild)).channels
  .getPins(channel.id)
  .then((msgs) => {
   const parsed = msgs.map((msg) => new Classes.Message(channel.client, msg));
   parsed.forEach((p) => {
    if ('skip' in channel ? true : channel.messages.cache.get(p.id)) return;
    (channel as Discord.GuildTextBasedChannel).messages.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(channel.guild, e);
   return e;
  });
};
