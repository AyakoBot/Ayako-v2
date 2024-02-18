import * as Discord from 'discord.js';
import { UsualMessagePayload } from '../../../../Typings/Typings.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';
import cache from '../../cache.js';
import error from '../../error.js';
import logError from '../../logError.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Sends a message to a Discord channel.
 * @param guild The guild where the channel is located.
 * @param channelId The ID of the channel where the message will be sent.
 * @param payload The message content and options.
 * @param client The Discord client instance.
 * @returns A Promise that resolves to a new Message object if the message was sent successfully,
 * or rejects with a DiscordAPIError if an error occurred.
 */
export default async (
 guild: Discord.Guild | undefined | null,
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 client: Discord.Client<true>,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (guild && !canSendMessage(channelId, payload, await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot send message`, [
   Discord.PermissionFlagsBits.ViewChannel,
   Discord.PermissionFlagsBits.SendMessages,
   Discord.PermissionFlagsBits.SendMessagesInThreads,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   Discord.PermissionFlagsBits.AttachFiles,
  ]);

  error(guild, e, false);
  return e;
 }

 return (guild ? cache.apis.get(guild.id) ?? API : API).channels
  .createMessage(channelId, {
   ...payload,
   message_reference: payload.message_reference
    ? { ...payload.message_reference, fail_if_not_exists: false }
    : undefined,
  })
  .then((m) => new Classes.Message(client, m))
  .catch((e: Discord.DiscordAPIError) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Determines whether the user can send a message in a channel.
 * @param channelId - The ID of the channel in which the message will be sent.
 * @param payload - The message payload, including optional files.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can send the message.
 */
export const canSendMessage = (
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 me: Discord.GuildMember,
) => {
 if (!channelId) return true;
 const channel = me.guild.channels.cache.get(channelId);
 if (!channel) return false;

 switch (true) {
  case !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ViewChannel):
   return false;
  case Number(me.communicationDisabledUntilTimestamp) > Date.now():
   return false;
  case channel &&
   !channel?.isThread() &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendMessages):
  case channel &&
   channel?.isThread() &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendMessagesInThreads):
   return false;
  case payload.tts &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendTTSMessages): {
   payload.tts = false;
   return true;
  }
  case payload.message_reference &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ReadMessageHistory): {
   payload.message_reference = undefined;
   return true;
  }
  case payload.files?.length &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.AttachFiles):
   return false;

  default:
   return true;
 }
};

/**
 * Checks if the given payload is a valid message payload.
 * @param payload The message payload to validate.
 * @returns Returns true if the payload is valid, otherwise false.
 */
export const isValidPayload = (payload: UsualMessagePayload) => {
 const e = (text: string, log: unknown) => {
  logError(`> ${text}\n${JSON.stringify(log)}`, false);
  logError(text, true);
  return false;
 };

 if (Number(payload.content?.length) > 2000) return e('Content too long', payload.content);
 if (payload.embeds?.length) {
  if (Number(payload.embeds.length) > 10) return e('Too many Embeds', payload.embeds);
  if (payload.embeds && getEmbedCharLens(payload.embeds) > 6000) {
   return e('Embeds content too long', payload.embeds);
  }

  const embedsValid = payload.embeds
   .map((embed) => {
    if (Number(embed.title?.length) > 256) return e('Embed Title too long', embed.title);
    if (Number(embed.description?.length) > 4096) {
     return e('Embed Description too long', embed.description);
    }

    if (Number(embed.footer?.text?.length) > 2048) return e('Embed Footer too long', embed.footer);
    if (Number(embed.author?.name?.length) > 2048) return e('Embed Author too long', embed.author);

    if (!embed.fields?.length) return true;
    if (embed.fields.length > 25) return e('Too many Embed Fields', embed.fields);
    return embed.fields
     ?.map((f) => {
      if (Number(f.name?.length) > 256) return e('Embed Field Name too long', f.name);
      if (Number(f.value?.length) > 1024) return e('Embed Field Value too long', f.value);
      return true;
     })
     .every((f) => !!f);
   })
   .every((f) => !!f);

  if (!embedsValid) return embedsValid;
 }

 if (payload.components) {
  const check = payload.components
   .map((actionRow) => {
    if (!actionRow.components.length) return e('Empty Action Row', actionRow);
    const check1 = actionRow.components
     .map((c) => {
      switch (c.type) {
       case Discord.ComponentType.Button: {
        if (Number(c.label?.length) > 80) return e('Button Label too long', c.label);
        if ('custom_id' in c && Number(c.custom_id?.length) > 100) {
         return e('Button Custom ID too long', c.custom_id);
        }
        break;
       }
       case Discord.ComponentType.RoleSelect:
       case Discord.ComponentType.UserSelect:
       case Discord.ComponentType.MentionableSelect:
       case Discord.ComponentType.StringSelect:
       case Discord.ComponentType.ChannelSelect: {
        if (Number(c.custom_id?.length) > 100) {
         return e('Select Menu Custom ID too long', c.custom_id);
        }
        if ('options' in c) {
         if (c.options.length > 25) return e('Too many Select Menu Options', c.options);
         const check2 = c.options
          .map((o) => {
           if (o.label.length > 100) return e('Select Menu Option Label too long', o.label);
           if (o.value.length > 100) return e('Select Menu Option Value too long', o.value);
           if (Number(o.description?.length) > 100) {
            return e('Select Menu Option Description too long', o.description);
           }
           return true;
          })
          .every((f) => !!f);
         if (!check2) return check2;
        }
        if (Number(c.placeholder?.length) > 150) {
         return e('Select Menu Placeholder too long', c);
        }
        if (c.min_values && c.min_values > 25) {
         return e('Select Menu Min Values too high', c);
        }
        if (c.min_values && c.min_values < 0) {
         return e('Select Menu Min Values too low', c);
        }
        if (c.max_values && c.max_values > 25) {
         return e('Select Menu Max Values too high', c);
        }
        break;
       }
       default:
        return true;
      }
      return true;
     })
     .every((f) => !!f);
    if (!check1) return check1;
    return true;
   })
   .every((f) => !!f);
  if (!check) return check;
 }

 return true;
};

/**
 * Calculates the total character length of all strings in an array of Discord API embeds.
 * @param embeds - An array of Discord API embeds.
 * @returns The total character length of all strings in the embeds.
 */
export const getEmbedCharLens = (embeds: Discord.APIEmbed[]) => {
 let total = 0;
 embeds.forEach((embed) => {
  Object.values(embed).forEach((data) => {
   if (typeof data === 'string') {
    total += data.length;
   }
  });

  for (let i = 0; i < (embed.fields ? embed.fields.length : 0); i += 1) {
   const field = embed.fields ? embed.fields[i] : null;

   if (!field) return;

   if (typeof field.name === 'string') total += field.name.length;
   if (typeof field.value === 'string') total += field.value.length;
  }
 });
 return total;
};
