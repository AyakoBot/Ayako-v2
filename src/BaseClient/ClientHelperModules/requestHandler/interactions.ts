import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
import cache from '../cache.js';

export default {
 reply: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  body: Discord.APIInteractionResponseCallbackData & {
   files?: Discord.RawFile[];
  },
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions.reply(interactionId, token, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 defer: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  body: Discord.APIInteractionResponseCallbackData & {
   files?: Discord.RawFile[];
  },
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions.defer(interactionId, token, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 deferMessageUpdate: (guild: Discord.Guild, interactionId: string, token: string) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .deferMessageUpdate(interactionId, token)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 followUp: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  body: Discord.APIInteractionResponseCallbackData & {
   files?: Discord.RawFile[];
  },
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions.followUp(interactionId, token, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editReply: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  body: Discord.APIInteractionResponseCallbackData & {
   files?: Discord.RawFile[];
  },
  messageId: string | '@original',
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .editReply(interactionId, token, body, messageId)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getOriginalReply: (guild: Discord.Guild, interactionId: string, token: string) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .getOriginalReply(interactionId, token)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteReply: (guild: Discord.Guild, interactionId: string, token: string) =>
  (cache.apis.get(guild.id) ?? API).interactions.deleteReply(interactionId, token).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 updateMessage: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  body: Discord.APIInteractionResponseCallbackData & {
   files?: Discord.RawFile[];
  },
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .updateMessage(interactionId, token, body)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 createAutocompleteResponse: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  data: Discord.APICommandAutocompleteInteractionResponseCallbackData,
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .createAutocompleteResponse(interactionId, token, data)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 createModal: (
  guild: Discord.Guild,
  interactionId: string,
  token: string,
  data: Discord.APIModalInteractionResponseCallbackData,
 ) =>
  (cache.apis.get(guild.id) ?? API).interactions
   .createModal(interactionId, token, data)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
};
