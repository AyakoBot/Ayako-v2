import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import { canGetMessage } from './getMessage.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves a list of users who reacted with a specific emoji to a message.
 * @param message The message to retrieve reactions from.
 * @param emoji The emoji to retrieve reactions for.
 * @param query Optional query parameters to filter the results.
 * @returns A promise that resolves with an array of users who reacted with the specified emoji.
 */
export default async (
 msg: Discord.Message<true>,
 emoji: string,
 query?: Discord.RESTGetAPIChannelMessageReactionUsersQuery,
) => {
 if (!canGetMessage(msg.channel, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot get reactions of emoji ${emoji} in ${msg.guild.name} / ${msg.guild.id}`,
   [
    Discord.PermissionFlagsBits.ViewChannel,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(
     msg.channel.type,
    )
     ? [Discord.PermissionFlagsBits.Connect]
     : []),
   ],
  );

  error(msg.guild, e);
  return e;
 }

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  const e = requestHandlerError(`Invalid Emoji ${emoji}`, []);

  error(msg.guild, e);
  return e;
 }

 return (cache.apis.get(msg.guild.id) ?? API).channels
  .getMessageReactions(
   msg.channel.id,
   msg.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
   query,
  )
  .then((users) => {
   const parsed = users.map((u) => new Classes.User(msg.client, u));
   parsed.forEach((p) => {
    if (
     msg.reactions.cache
      .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
      ?.users.cache.get(p.id)
    ) {
     return;
    }

    if (
     (resolvedEmoji.id ?? resolvedEmoji.name) &&
     !msg.reactions.cache.get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
    ) {
     msg.reactions.cache.set(
      resolvedEmoji.id ?? resolvedEmoji.name ?? '',
      new Classes.MessageReaction(
       msg.client,
       {
        count: parsed.length,
        emoji: {
         id: resolvedEmoji.id ?? null,
         name: resolvedEmoji.name ?? null,
         animated: resolvedEmoji.animated,
        },
        me: false,
        me_burst: false,
        burst_colors: [],
        count_details: {
         burst: 0,
         normal: parsed.length,
        },
       },
       msg,
      ),
     );
    }

    msg.reactions.cache
     .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
     ?.users.cache.set(p.id, p);
   });
  })
  .catch((e) => {
   error(msg.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
