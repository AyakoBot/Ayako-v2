import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Creates a new stage instance associated with a stage channel.
 * @param channel The stage channel to associate the stage instance with.
 * @param body The JSON body of the API request.
 * @param reason The reason for creating the stage instance.
 * @returns A promise that resolves with the created stage instance
 * or rejects with a DiscordAPIError.
 */
const create = (
 channel: Discord.StageChannel,
 body: Discord.RESTPostAPIStageInstanceJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).stageInstances
  .create(body, { reason })
  .then((s) => new Classes.StageInstance(channel.client, s, channel))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the stage instance associated with the given stage channel.
 * @param channel The stage channel to retrieve the stage instance for.
 * @returns A promise that resolves with the stage instance, or rejects with an error.
 */
const get = async (channel: Discord.StageChannel) =>
 channel.guild.stageInstances.cache.find((s) => s.channelId === channel.id) ??
 (cache.apis.get(channel.guild.id) ?? API).stageInstances
  .get(channel.id)
  .then((s) => {
   const parsed = new Classes.StageInstance(channel.client, s, channel);
   if (channel.guild.stageInstances.cache.get(parsed.id)) return parsed;
   channel.guild.stageInstances.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a stage instance in a stage channel.
 * @param channel The stage channel where the stage instance is located.
 * @param body The new properties for the stage instance.
 * @param reason The reason for editing the stage instance.
 * @returns A promise that resolves with the updated stage instance
 * or rejects with a DiscordAPIError.
 */
const edit = (
 channel: Discord.StageChannel,
 body: Discord.RESTPatchAPIStageInstanceJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).stageInstances
  .edit(channel.id, body, { reason })
  .then((s) => new Classes.StageInstance(channel.client, s, channel))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a stage instance in a guild's voice channel.
 * @param guild - The guild where the stage instance is located.
 * @param channelId - The ID of the voice channel where the stage instance is located.
 * @param reason - The reason for deleting the stage instance.
 * @returns A promise that resolves with the deleted stage instance,
 * or rejects with a DiscordAPIError.
 */
const del = (guild: Discord.Guild, channelId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).stageInstances.delete(channelId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Helper methods for interacting with Stage Instances.
 * @property {Function} create
 * - Creates a new Stage Instance.
 * @property {Function} get
 * - Gets a Stage Instance by ID.
 * @property {Function} edit
 * - Edits an existing Stage Instance.
 * @property {Function} delete
 * - Deletes a Stage Instance by ID.
 */
export default {
 create,
 get,
 edit,
 delete: del,
};
